/** Descrição textual do tempo para execução da callback. */
export type Timeout = `${number} ${'s' | 'ms'}`

/** Mensagem de erro. */
export interface Message {
    /** Tipo de erro. Usado para evitar mensagens repetidas. */
    readonly kind: string
    /** Descrição textual do erro. */
    readonly message: string
    /** Tempo de resolução da mensagem. Ela deverá ser removida após esse tempo. */
    readonly timeout?: Timeout | undefined
    /** Se o erro é muito importante ou não. */
    readonly severe?: boolean | undefined
}

/** Consumidor de mensagens de erro. */
export interface Consumer {
    /** Recebe uma mensagem de erro. */
    receive(message: Message): void
}

/** Consumidor de mensagens de erro que repassa para vários subconsumidores. */
export interface Relay extends Consumer {
    /**
     * Adiciona subconsumidor para futuras mensagens de erro.
     *
     * @returns Callback para remoção do consumidor.
     */
    add(consumer: Consumer): () => void
}
