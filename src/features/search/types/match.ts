/** URL do WebSocket. */
export const webSocketEndpoint = 'api/busca/ws'

/** Um resultado da busca retornado pela API. */
export abstract class Match {
    /** Identificador único da match, como chave da lista. */
    abstract uniqueMatchIdentifier(): string

    /** Descrição textual da match, única entre qualquer resultado possível. */
    abstract uniqueMatchDescription(): string

    /** URL da página relacionada a aquele resultado. */
    abstract asUrl(): string | undefined
}
