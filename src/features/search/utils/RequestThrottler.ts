/* eslint-disable @typescript-eslint/no-unused-vars */
import { distance as levenshtein } from 'fastest-levenshtein'

/** Função que não faz nada, usada como padrão das callbacks. */
export function doNothing() { }

/**
 *  Limitador de requisições, que só faz uma requisição depois de
 * {@link ControlledInterval.waitMillis} milissegundos terem passados da última requisição,
 * ou se o texto da caixa de entrada mudou mais que {@link StreamBarrier.maxDistinctChars}
 * caracteres. As requisições são feitas por um WebSocket.
 *
 * As entrada recebidas (em {@link next}) enquanto o sistema está em espera podem ser ignoradas.
 */
export class RequestThrottler<Content> {
    /** Controle de intervalo de tempo para requisição. */
    private readonly interval: ControlledInterval
    /** Barreira enquanto o intervalo não é concluído. */
    private readonly barrier: StreamBarrier
    /** Socket para comunicação. */
    private readonly socket: RequestQueue<Content>
    /** Última query enviada pelo webSocket. */
    private lastQuery: string = ''

    /** Callback do estado de loading. */
    setLoading: (isLoading: boolean) => void = doNothing

    /**
     * @param url URL do WebSocket.
     * @param parser Parser da resposta do web socket.
     * @param maxDistinctChars Maior número de caracteres distintos na caixa busca que segue o
     *  tempo de espera entre requisições. Se o texto mudar mais caracteres do que isso, a
     *  requisição é iniciada imediatamente. (padrão: 5)
     * @param waitMillis Tempo de espera entre requisições normais em milissegundos. (padrão: 1000)
     *  (padrão: 5)
     */
    constructor(
        url: string,
        parser: (query: string, response: string) => Content,
        maxDistinctChars = 4,
        waitMillis = 500,
    ) {
        this.interval = new ControlledInterval(waitMillis)
        this.barrier = new StreamBarrier(maxDistinctChars)
        this.socket = new RequestQueue(url, (message) => parser(this.lastQuery, message))

        // quando a barreira envia um valor
        this.barrier.onSend = (query) => {
            // inicia novo intervalo (tempo que a barreira deveria ficar fechada)
            this.interval.start()
            // e passa o valor pelo socket
            this.socket.send(query)
            this.lastQuery = query
        }
        // quando o intervalo concluir
        this.interval.onComplete = () => {
            // abre a barreira
            this.barrier.open()
        }
        /// para o loading quando não tiver requisições
        this.socket.onEmpty = () => {
            this.setLoading(false)
        }
        // inicia com a barreira aberta
        this.barrier.open()
    }

    /** Entrada de valores para a stream. */
    next(query: string) {
        this.barrier.next(query)
    }

    close() {
        this.setLoading = doNothing
        this.barrier.close()
        this.interval.close()
        this.socket.close()
    }

    /** Callback para situações de erro. */
    set onError(callback: (error: any) => void) {
        this.socket.onError = callback
    }

    /** Callaback para quando o servidor responder alguma requisição. */
    set onOutput(sendValue: (content: Content) => void) {
        this.socket.onOutput = (content) => {
            this.setLoading(false)
            sendValue(content)
        }
    }
}

/**
 *  Fila de requisições de busca na API por WebSocket.
 */
export class RequestQueue<T> {
    /** Parser dos JSON recebido. */
    private readonly parse: (message: string) => T
    /** WebSocket para a comunicação com timeout. */
    private readonly socket: TimedWebSocket

    /** Callback para o resultado da requisição. */
    onOutput: (output: T) => void = doNothing
    /** Callback para erro na requisição. */
    onError: (error: any) => void = doNothing
    /** Callback para quando a fila se torna vazia. */
    onEmpty: () => void = doNothing

    /** Abre socket em URL e parseia os resultados. */
    constructor(url: string, parser: (message: string) => T) {
        this.parse = parser
        this.socket = new TimedWebSocket(url)

        this.socket.onMessage = (message) => {
            this.receive(message)
        }
        this.socket.onError = () => {
            this.onError(null)
            this.checkEmpty()
        }
    }

    private checkEmpty() {
        if (!this.socket.hasOpenRequests) {
            this.onEmpty()
        }
    }

    private receive(data: unknown) {
        try {
            this.onOutput(this.parse(`${data}`))
        } catch (error: any) {
            this.onError(error)
        } finally {
            this.checkEmpty()
        }
    }

    send(query: string) {
        this.socket.send(query)
    }

    close() {
        this.onOutput = doNothing
        this.onError = doNothing
        this.onEmpty = doNothing
        this.socket.close()
    }
}

class TimedWebSocket {
    private readonly url: string
    private inner: QueueWebSocket | undefined
    private interval: ControlledInterval

    onMessage: (output: unknown) => void = doNothing
    onError: () => void = doNothing

    constructor(url: string, socketTimeout: number = 60) {
        this.url = url
        this.interval = new ControlledInterval(socketTimeout * 1000)

        this.interval.onComplete = () => {
            this.inner?.close()
        }
    }

    private openSocket() {
        this.inner = new QueueWebSocket(
            this.url,
            this.onMessage,
            this.onError,
            () => {
                delete this.inner
            },
        )
        return this.inner
    }

    private get socket() {
        return this.inner ?? this.openSocket()
    }

    get hasOpenRequests() {
        if (this.inner) {
            return this.inner.openRequests <= 0
        } else {
            return false
        }
    }

    send(query: string) {
        this.socket.send(query)
        this.interval.start()
    }

    close() {
        this.onError = doNothing
        this.onMessage = doNothing

        this.inner?.close()
        delete this.inner
        this.interval.close()
    }
}

class QueueWebSocket extends WebSocket {
    private queue: string | undefined
    private sent: number = 0
    private received: number = 0

    constructor(
        url: string,
        onMessage: (data: unknown) => void = doNothing,
        onError: () => void = doNothing,
        onClose: () => void = doNothing,
    ) {
        super(url)

        this.onmessage = (event) => {
            this.received += 1
            onMessage(event.data)
        }
        this.onerror = () => {
            this.received += 1
            onError()
        }
        this.onopen = () => {
            if (this.queue !== undefined) {
                super.send(this.queue)
                this.sent += 1
            }
        }
        this.onclose = onClose
    }

    send(data: string) {
        if (this.readyState === this.OPEN) {
            super.send(data)
            this.sent += 1
        } else {
            this.queue = data
        }
    }

    get openRequests() {
        return this.sent - this.received
    }
}

/**
 *  Barreira sobre uma stream de strings, que libera a última string não-vazia recebida somente
 * quando a barreira está aberta e a string é diferente da última enviada (distância
 * {@link levenshtein} maior que zero). Se a distância calculada for maior que {@link maxDistance},
 * a string é enviada mesmo se a barreira estivar fechada.
 *
 *  Além disso, se a stream de entrada (recebida por {@link next}) for atualizada antes da barreira
 * ser aberta, o valor antigo é esquecido.
 */
class StreamBarrier {
    /** Maior valor de distância que a barreira interrompe a passagem. */
    private readonly maxDistance: number

    /** Última string enviada. */
    private lastSent = ''
    /** Última recebida, possivelmente próxima a ser enviada. */
    private lastReceived = ''
    /** Quantidade de caracteres distintos entre {@link lastSent} e {@link lastReceived}. */
    private distance = 0
    /** Se a barreira está aberta. */
    private isOpen = false

    /** Callback para valores emitidos pela barreira. */
    onSend: (value: string) => void = doNothing

    /** @param maxDistance Maior valor de distância que a barreira interrompe a passagem. */
    constructor(maxDistance: number) {
        this.maxDistance = maxDistance
    }

    /** Envia {@link lastReceived} se for não-vazia e diferente de {@link lastSent}. */
    private send() {
        if (this.lastReceived && this.distance > 0) {
            // fecha a barreira
            this.isOpen = false
            // e envia
            this.lastSent = this.lastReceived
            this.distance = 0
            this.onSend(this.lastReceived)
        }
    }

    /** Atualiza distância entre as strings e envia se for o caso. */
    private updateDistance() {
        this.distance = levenshtein(this.lastSent, this.lastReceived)
        // envia se aberto ou se a distância for muito grande
        if (this.isOpen || this.distance > this.maxDistance) {
            this.send()
        }
    }

    /** Recebe string da stream de entrada. */
    next(value: string) {
        this.lastReceived = value
        this.updateDistance()
    }

    /** Abre a barreira para envio. */
    open() {
        this.isOpen = true
        this.send()
    }

    close() {
        this.onSend = doNothing
        this.isOpen = false
    }
}

/** ID da execução do {@link setTimeout}. */
type TimeoutID = ReturnType<typeof setTimeout>

/**
 *  Classe com funcionamento parecido com o {@link setInterval}, mas com controle de conclusão
 * e inicalização assíncrona (o intervalo pode ser terminado antes do tempo esperado).
 */
class ControlledInterval {
    /** Tempo de conclusão em mili segundos. */
    private readonly waitMillis: number

    /** ID da execução atual. */
    private timeoutID: TimeoutID | undefined = undefined
    /** Callback quando o intervalo é concluído. */
    onComplete: () => void = doNothing

    /** @param waitMillis tempo predefinido para conclusão. */
    constructor(waitMillis: number) {
        this.waitMillis = waitMillis
    }

    /** Encerra a execução atual, sem concluir. */
    private cancel() {
        if (this.timeoutID !== undefined) {
            clearTimeout(this.timeoutID)
            this.timeoutID = undefined
        }
    }

    /**
     * Inicia nova execução para ser completada após {@link waitMillis}.
     */
    start() {
        this.cancel()

        this.timeoutID = setTimeout(() => {
            this.complete()
        }, this.waitMillis)
    }

    /** Completa a execução atual */
    complete() {
        this.cancel()
        this.onComplete()
    }

    close() {
        this.onComplete = doNothing
        this.cancel()
    }
}
