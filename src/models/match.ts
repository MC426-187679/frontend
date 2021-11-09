import { Parser } from 'utils/parsing'
import { fetchJson } from 'utils/fetching'

/** Um resultado da busca retornado pela API. */
abstract class Match {
    /** Identificador único da match, como chave da lista. */
    abstract uniqueMatchIdentifier(): string

    /** Descrição textual da match, única entre qualquer resultado possível. */
    abstract uniqueMatchDescription(): string

    /** URL da página relacionada a aquele resultado. */
    abstract asUrl(): string | undefined

    /** Se duas matchs são idênticas. */
    static equals(first: Match, other: Match) {
        const firstID = first.uniqueMatchIdentifier()
        const otherID = other.uniqueMatchIdentifier()
        return firstID === otherID
    }
}

/** Parser para um tipo de resultado específico. */
export interface Matcher {
    /** Nome do tipo de conteúdo esperado pelo parser. */
    readonly content: string
    /** Função que faz o parsing do resultado. */
    readonly parse: Parser<Match>
}

export namespace Matcher {
    /** Parser para cada tipo de conteúdo retornado pela API. */
    const matchers = new Map<string, Matcher>()

    /**
     * Registra parser para um tipo de resultado. Só deve ser chamada uma vez por tipo de conteúdo.
     *
     * @param matcher Parser do conteúdo especificado.
     *
     * @throws Erro genérico, caso o tipo de conteúdo já tenha um parser registrado.
     */
    export function register(matcher: Matcher) {
        if (matchers.has(matcher.content)) {
            // não deveria chegar nesse caso nunca
            throw new Error(`${matcher.content} já tem um parser associado.`)
        }

        matchers.set(matcher.content, matcher)
    }

    /** Lista de tipos de conteúdos com parser associado. */
    export function available() {
        const parsers = [] as Matcher[]

        matchers.forEach((matcher) => {
            parsers.push(matcher)
        })
        return parsers
    }

    /**
     * Recupera parser para um conteúdo retorna na busca pela API.
     *
     * @param content Conteúdo que será parseado.
     *
     * @throws {@link MissingParser} se o conteúdo especificado não tem nenhum parser associado.
     */
    export function parserFor(content: string) {
        const parser = matchers.get(content)?.parse
        if (!parser) {
            throw new MissingParser(content)
        }

        return parser
    }

    /** Erros durante parsing dos resultados de busca pela API. */
    export class MissingParser extends Parser.Error<string> {
        constructor(content: string) {
            super(content, 'Match')
            Parser.Error.captureStackTrace(this, MissingParser)

            const parsers = available().map((matcher) => matcher.content)
            this.message = `Nenhum parser encontrado para ${content}.`
                + ` Os conteúdos esperados são ${parsers}.`
        }
    }
}

namespace Match {
    /**
     * Parseia um resultado da API.
     *
     * @param match Objeto qualquer.
     * @returns Resultado transformado a partir de `match`.
     *
     * @throws {@link MissingParser} se o conteúdo especificado não tem nenhum parser associado.
     * @throws {@link Parser.Error} se o objeto não tem os campos esperados.
     */
    export function parse(match: any) {
        const content = Parser.string(match.content, { required: true })

        const parser = Matcher.parserFor(content)
        return parser(match)
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
     * @param init Configurações da requisição.
     * @return lista dos resultados para o texto, ordenados de maior para menor relevância.
     *
     * @throws Erros do {@link fetchJson} ou do {@link parse}.
     */
    export async function fetch(text: string, init?: RequestInit) {
        const matches = await fetchJson(searchURL(text), init)
        return Parser.array(matches, Match.parse, { required: false })
    }
}

export { Match }
