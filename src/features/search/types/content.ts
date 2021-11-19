import { Match } from './match'
import { Matcher } from './matcher'

/** Conteúdo adaptado de {@link Match}. */
export interface MatchedContent {
    /** Resultado de {@link Match.uniqueMatchIdentifier}. */
    readonly identifier: string
    /** Resultado de {@link Match.uniqueMatchDescription}. */
    readonly description: string
    /** Resultado de {@link Match.asUrl}. */
    readonly url: string | undefined
}

export namespace MatchedContent {
    /** Conversão de {@link Match} para {@link MatchedContent}. */
    export function from(match: Match): MatchedContent {
        return {
            identifier: match.uniqueMatchIdentifier(),
            description: match.uniqueMatchDescription(),
            url: match.asUrl(),
        }
    }
}

/** Conjunto de resultados retornados pela API de busca. */
export interface Matches {
    /** Texto usado na busca. */
    readonly query: string
    /** Resultados da busca. */
    readonly results: ReadonlyArray<MatchedContent>
}

export namespace Matches {
    /** Resultados iniciais, para busca vazia. */
    export function empty(): Matches {
        return { query: '', results: [] }
    }

    /**
     * Faz busca pela API REST.
     *
     * @param text texto a ser buscado.
     * @param init Opções de requisição do {@link fetch}.
     * @return lista dos resultados para o texto, ordenados de maior para menor relevância.
     *
     * @throws Erros do {@link Match.fetch}.
     */
    export async function fetch(query: string, init?: RequestInit) {
        const matches = await Match.fetch(query, Matcher.parse, init)
        const results = matches.map(MatchedContent.from)

        return { query, results } as Matches
    }
}
