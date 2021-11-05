import { useState, useMemo } from 'react'
import { distance as levenshtein } from 'fastest-levenshtein'

import { Match } from 'models/match'

/** Conjunto de resultados retornados pela API de busca. */
export interface Matches {
    /** Texto usado na busca. */
    readonly query: string
    /** Resultados da busca. */
    readonly results: ReadonlyArray<Match>
}

namespace Matches {
    /** Resultados iniciais, para busca vazia. */
    export function empty(): Matches {
        return { query: '', results: [] }
    }
}

/** Função que coloca query na lista de espera para requisição. */
export type Search = (query: string) => void

/** Opções para {@link useMatches} e para o {@link RequestThrottler}. */
interface Config {
    /**
     *  Maior número de caracteres distintos na caixa busca que segue o tempo de espera
     * entre requisições. Se o texto mudar mais caracteres do que isso, a requisição é
     * iniciada imediatamente.
     */
    readonly maxDistinctChars?: number
    /* Tempo de espera entre requisições normais. */
    readonly waitMillis?: number
    /** Maior número de requisições não-resolvidas em um dado momento. */
    readonly maxOpenRequests?: number
    /** Callback para requisições que resultam em erro. */
    readonly onError?: (error: any) => void
    /** Callback para quando a fila de requisições está cheia. */
    readonly onFull?: () => void
    /** Callback para atualização do estado de loading. */
    readonly setLoading?: (isLoading: boolean) => void
}

/** Função que não faz nada, usada como padrão das callbacks. */
function doNothing() { }

/**
 *  Hook que mantém estado dos resultados de busca, com uma função que insere novas
 * opções na lista de espera para requisições ao servidor.
 *
 * @param {Config} config Configurações do limitador de requisições ({@link Config}).
 * @param config.maxDistinctChars padrão: 5.
 * @param config.waitMillis padrão: 1000.
 * @param config.maxOpenRequests padrão: 5.
 *
 * @returns Resultados atuais e função para busca de próximos resultados.
 */
export function useMatches({
    maxDistinctChars = 5,
    waitMillis = 1000,
    maxOpenRequests = 5,
    onError = doNothing,
    onFull = doNothing,
    setLoading = doNothing,
}: Config = {}): [Matches, Search] {
    // resultados e limitador compartilham o mesmo estado
    const [{ matches: current, throttler }, setMatches] = useState(() => ({
        matches: Matches.empty(),
        // as configurações são usada apenas no setup
        throttler: new RequestThrottler({
            maxDistinctChars,
            waitMillis,
            maxOpenRequests,
            onError,
            onFull,
            setLoading,
        }),
    }))

    // de forma memoizada
    const search = useMemo(() => {
        // passa os resultados para o atualizador de estados
        throttler.onMatches = (matches) => {
            // sem mudar o limitador
            setMatches({ matches, throttler })
        }
        // e monta função de busca
        return (query: string) => throttler.next(query)
    }, [setMatches])

    return [current, search]
}

/**
 *  Limitador de requisições, que só faz uma requisição depois de {@link Config.waitMillis} terem
 * passados da última requisição, ou se o texto da caixa de entrada mudou mais que
 * {@link Config.maxDistinctChars} caracteres. Se existirem {@link Config.maxOpenRequests}
 * requisições não concluídas, espera uma delas terminar para fazer a próxima.
 *
 * As entrada recebidas (em {@link next}) enquanto o sistema está em espera podem ser ignoradas.
 */
class RequestThrottler {
    /** Controle de intervalo de tempo para requisição. */
    private readonly interval: ControlledInterval
    /** Barreira enquanto o intervalo não é concluído. */
    private readonly barrier: StreamBarrier
    /** Fila para evitar muitas requisições em aberto. */
    private readonly queue: RequestQueue
    /** Callaback para quando o servidor responder alguma requisição. */
    onMatches: (matches: Matches) => void = doNothing

    constructor(config: Required<Config>) {
        this.interval = new ControlledInterval(config.waitMillis)
        this.barrier = new StreamBarrier(config.maxDistinctChars)
        this.queue = new RequestQueue(config.maxOpenRequests)
        this.queue.onFull = config.onFull

        this.setup(config)
        // inicia com a barreira aberta
        this.barrier.open()
    }

    /** Monta a lógica com as streams de dados. */
    private setup({ setLoading, onError }: Required<Config>) {
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
        // quando uma requisição iniciar
        this.queue.onRequestStart = () => {
            // marca o loading
            setLoading(true)
        }
        // quando uma requisição for concluída
        this.queue.onOutput = (results, query) => {
            // encerra o loading e passa a diante
            setLoading(false)
            this.onMatches({ results, query })
        }
        // em caso de erro
        this.queue.onError = (error) => {
            // encerra o loading e acusa o erro
            setLoading(false)
            onError(error)
        }
    }

    /** Entrada de valores para a stream. */
    next(query: string) {
        this.barrier.next(query)
    }
}

/**
 *  Fila de requisições de busca na API. Enquanto o número de requisições não concluídas for menor
 * que {@link maxOpenRequests}, as requisições são feitas diretamente. Caso contrário, o último
 * pedido é armazenado em {@link waiting} até alguma requsição encerrar.
 */
class RequestQueue {
    /** Maior número de requisições não concluídas em um dado momento. */
    private readonly maxOpenRequests: number
    /** Número de requisições não concluídas. */
    private openRequests = 0
    /** Fila de tamanho um, para o último pedido não realizado. */
    private waiting: string | undefined

    /** Callback para o resultado da requisição. */
    onOutput: (output: Match[], input: string) => void = doNothing
    /** Callback para erro na requisição. */
    onError: (error: any) => void = doNothing
    /** Callback para quando a fila está cheia. */
    onFull: () => void = doNothing
    /** Callback chamada antes da requisição de busca. */
    onRequestStart: (input: string) => void = doNothing

    /** @param maxOpenRequests Maior número de requisições ao mesmo tempo. */
    constructor(maxOpenRequests: number) {
        this.maxOpenRequests = maxOpenRequests
    }

    /** Faz a requisição com a string de busca dada. */
    private async makeRequest(input: string) {
        // marca a requisição como aberta
        this.openRequests += 1
        try {
            this.onRequestStart(input)
            const output = await Match.fetch(input)
            this.onOutput(output, input)
        } catch (error) {
            this.onError(error)
        } finally {
            // e fecha após concluída
            this.openRequests -= 1
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
    private timeoutID: TimeoutID | undefined
    /** Callback quando o intervalo é concluído. */
    onComplete: () => void = doNothing

    /** @param waitMillis tempo predefinido para conclusão. */
    constructor(waitMillis: number) {
        this.waitMillis = waitMillis
        this.timeoutID = undefined
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
