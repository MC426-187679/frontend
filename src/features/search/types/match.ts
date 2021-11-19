import { Parser } from 'utils/parsing'
import { Fetch } from 'utils/fetching'

/** Um resultado da busca retornado pela API. */
export abstract class Match {
    /** Identificador único da match, como chave da lista. */
    abstract uniqueMatchIdentifier(): string

    /** Descrição textual da match, única entre qualquer resultado possível. */
    abstract uniqueMatchDescription(): string

    /** URL da página relacionada a aquele resultado. */
    abstract asUrl(): string | undefined

    /**
     * Faz busca pela API REST.
     *
     * @param text texto a ser buscado.
     * @param parser função que parseia para um resultado da busca.
     * @param init Opções de requisição do {@link fetchJson}.
     * @return lista dos resultados para o texto, ordenados de maior para menor relevância.
     *
     * @throws Erros do {@link fetchJson} ou do {@link parse}.
     */
    static async fetch(text: string, parser: Parser<Match>, init?: RequestInit) {
        const matches = await Fetch.json(searchURL(text), init)
        return Parser.array(matches, parser, { required: false })
    }
}

/** Constrói URL para busca na API. */
export function searchURL(query: string, limit = 25) {
    const params = new URLSearchParams({
        query,
        limit: `${limit}`,
    })
    return `/api/busca?${params}` as const
}
