import { Parser } from 'utils/parsing'
import { fetchJson } from 'utils/fetching'

/** Um resultado da busca retornado pela API. */
export abstract class Match {
    /** Identificador único da match, como chave da lista. */
    abstract uniqueMatchIdentifier(): string

    /** Descrição textual da match, única entre qualquer resultado possível. */
    abstract uniqueMatchDescription(): string

    /** URL da página relacionada a aquele resultado. */
    abstract asUrl(): string | undefined
}

/** Constrói URL para busca na API. */
export function searchURL(query: string, limit = 25) {
    const params = new URLSearchParams({
        query,
        limit: `${limit}`,
    })
    return `/api/busca?${params}` as const
}

/**
 * Faz busca pela API REST.
 *
 * @param text texto a ser buscado.
 * @return lista dos resultados para o texto, ordenados de maior para menor relevância.
 *
 * @throws Erros do {@link fetchJson} ou do {@link parse}.
 */
export async function fetch(text: string, parser: Parser<Match>) {
    const matches = await fetchJson(searchURL(text))
    return Parser.array(matches, parser, { required: false })
}
