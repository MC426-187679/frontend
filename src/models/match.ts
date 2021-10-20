import { Parser } from 'utils/parsing'
import { fetchJson } from 'utils/fetching'

/** Uma resultado da busca retornada pela API. */
export type Match = Matched.Discipline | Matched.Course

export namespace Matched {
    /** Descrição do conteúdo do resultado. */
    export const enum Content {
        Discipline = 'discipline',
        Course = 'course',
    }

    /** Um resultado de disciplina para a busca. */
    export interface Discipline {
        content: Content.Discipline
        /** Código da disciplina. */
        code: string
        /** Nome da disciplina. */
        name: string
    }

    /** Um resultado de curso para a busca. */
    export interface Course {
        content: Content.Course
        /** Código do curso. */
        code: string
        /** Nome do curso. */
        name: string
    }

    /**
     * Parseia um resultado da API.
     *
     * @throws {@link Parser.Error} se o resultado não tem os campos esperados.
     */
    function parse(match: any): Match {
        switch (match.content) {
            case Content.Discipline:
            case Content.Course:
                return {
                    content: match.content,
                    code: Parser.string(match.code, { required: true }),
                    name: Parser.string(match.name, { required: true }),
                }
            default:
                throw new Parser.Error(match, 'Match')
        }
    }

    /** Constrói URL para busca na API. */
    function searchURL(query: string, limit = 25) {
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
     * @throws Erros do {@link fetchJson}.
     */
    export async function search(text: string, init?: RequestInit) {
        const matches = await fetchJson(searchURL(text), init)
        return Parser.array(matches, parse, { required: false })
    }
}
