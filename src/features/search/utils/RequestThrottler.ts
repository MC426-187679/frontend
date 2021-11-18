import { distance as levenshtein } from 'fastest-levenshtein'

/** Função que não faz nada, usada como padrão das callbacks. */
function doNothing() { }

/**
 *  Limitador de requisições, que só faz uma requisição depois de
 * {@link ControlledInterval.waitMillis} milissegundos terem passados da última requisição,
 * ou se o texto da caixa de entrada mudou mais que {@link StreamBarrier.maxDistinctChars}
 * caracteres. Se existirem {@link RequestQueue.maxOpenRequests} requisições não concluídas,
 * espera uma delas terminar para fazer a próxima.
 *
 * As entrada recebidas (em {@link next}) enquanto o sistema está em espera podem ser ignoradas.
 */
export class RequestThrottler<Content> {
    /** Controle de intervalo de tempo para requisição. */
    private readonly interval: ControlledInterval
    /** Barreira enquanto o intervalo não é concluído. */
    private readonly barrier: StreamBarrier
    /** Fila para evitar muitas requisições em aberto. */
    private readonly queue: RequestQueue<Content>

    /**
     * @param fetch Função que faz a requisição do conteúdo.
     * @param maxDistinctChars Maior número de caracteres distintos na caixa busca que segue o
     *  tempo de espera entre requisições. Se o texto mudar mais caracteres do que isso, a
     *  requisição é iniciada imediatamente. (padrão: 5)
     * @param waitMillis Tempo de espera entre requisições normais em milissegundos. (padrão: 1000)
     * @param maxOpenRequests Maior número de requisições não-resolvidas em um dado momento.
     *  (padrão: 5)
     */
    constructor(
        fetch: (query: string) => Promise<Content>,
        maxDistinctChars = 5,
        waitMillis = 1000,
        maxOpenRequests = 5,
    ) {
        this.interval = new ControlledInterval(waitMillis)
        this.barrier = new StreamBarrier(maxDistinctChars)
        this.queue = new RequestQueue(maxOpenRequests, fetch)

        // quando a barreira envia um valor
        this.barrier.onSend = (query) => {
            // inicia novo intervalo (tempo que a barreira deveria ficar fechada)
            this.interval.start()
            // e passa o valor para a fila de requisições
            this.queue.enqueue(query)
        }
        // quando o intervalo concluir
        this.interval.onComplete = () => {
            // abre a barreira
            this.barrier.open()
        }
        // inicia com a barreira aberta
        this.barrier.open()
    }

    /** Entrada de valores para a stream. */
    next(query: string) {
        this.barrier.next(query)
    }

    /** Callback para fila de requisições cheia. */
    set onFull(callback: () => void) {
        this.queue.onFull = callback
    }

    /** Callback para situações de erro. */
    set onError(callback: (error: any) => void) {
        this.queue.onError = callback
    }

    /** Callback para atualização do estado de loading. */
    set setLoading(sendStatus: (isLoading: boolean) => void) {
        this.queue.onRequestStart = () => {
            sendStatus(true)
        }
        this.queue.onEmpty = () => {
            sendStatus(false)
        }
    }

    /** Callaback para quando o servidor responder alguma requisição. */
    set onOutput(sendValue: (content: Content) => void) {
        this.queue.onOutput = sendValue
    }
}

/**
 *  Fila de requisições de busca na API. Enquanto o número de requisições não concluídas for menor
 * que {@link maxOpenRequests}, as requisições são feitas diretamente. Caso contrário, o último
 * pedido é armazenado em {@link waiting} até alguma requsição encerrar.
 */
export class RequestQueue<T> {
    /** Maior número de requisições não concluídas em um dado momento. */
    private readonly maxOpenRequests: number
    /** Número de requisições não concluídas. */
    private openRequests = 0
    /** Fila de tamanho um, para o último pedido não realizado. */
    private waiting: string | undefined
    /** Função que faz a requisição assíncrona. */
    private readonly fetch: (query: string) => PromiseLike<T>

    /** Callback para o resultado da requisição. */
    onOutput: (output: T) => void = doNothing
    /** Callback para erro na requisição. */
    onError: (error: any) => void = doNothing
    /** Callback para quando a fila está cheia. */
    onFull: () => void = doNothing
    /** Callback para quando a fila se torna vazia. */
    onEmpty: () => void = doNothing
    /** Callback chamada antes da requisição de busca. */
    onRequestStart: (input: string) => void = doNothing

    /** @param maxOpenRequests Maior número de requisições ao mesmo tempo. */
    constructor(maxOpenRequests: number, fetch: (query: string) => PromiseLike<T>) {
        this.maxOpenRequests = maxOpenRequests
        this.fetch = fetch
    }

    /** Faz a requisição com a string de busca dada. */
    private async makeRequest(input: string) {
        // marca a requisição como aberta
        this.openRequests += 1
        try {
            this.onRequestStart(input)
            const output = await this.fetch(input)
            this.onOutput(output)
        } catch (error) {
            this.onError(error)
        } finally {
            // e fecha após concluída
            this.openRequests -= 1
            if (this.openRequests <= 0) {
                this.onEmpty()
            }
        }
    }

    /** Remove o elemento mais recente na lista de espera.  */
    private pop() {
        const query = this.waiting
        this.waiting = undefined
        return query
    }

    /** Faz requisição do próximo elemento na lista, se existir. */
    private requestNext() {
        const query = this.pop()

        // resultados de string com pelo menos 2 caracteres
        if (query && query.length > 2) {
            // faz requisição e, quando concluída, faz a próxima na lista
            this.makeRequest(query).finally(() => {
                this.requestNext()
            })
        }
    }

    /** Coloca requisição na fila. */
    enqueue(query: string) {
        this.waiting = query

        if (this.openRequests < this.maxOpenRequests) {
            this.requestNext()
        } else {
            this.onFull()
        }
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
export class StreamBarrier {
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
}

/** ID da execução do {@link setTimeout}. */
type TimeoutID = ReturnType<typeof setTimeout>

/**
 *  Classe com funcionamento parecido com o {@link setInterval}, mas com controle de conclusão
 * e inicalização assíncrona (o intervalo pode ser terminado antes do tempo esperado).
 */
export class ControlledInterval {
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
}
