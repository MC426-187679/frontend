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

    /** Se essa match é idêntica a outra. */
    equals(other: Match) {
        const thisID = this.uniqueMatchIdentifier()
        const otherID = other.uniqueMatchIdentifier()
        return thisID === otherID
    }
}

namespace Match {
    /** Parser para cada tipo de conteúdo retornado pela API. */
    const parsers = new Map<string, Parser<Match>>()

    /**
     * Registra parser para um tipo de resultado. Só deve ser chamada uma vez por tipo de conteúdo.
     *
     * @param content Nome do tipo de conteúdo esperado pelo parser.
     * @param parser Função que faz o parsing.
     *
     * @throws Erro genérico, caso o tipo de conteúdo já tenha um parser registrado.
     */
    export function registerParser(content: string, parser: Parser<Match>) {
        if (parsers.has(content)) {
            // não deveria chegar nesse caso nunca
            throw new Error(`${content} já tem um parser associado.`)
        }

        parsers.set(content, parser)
    }

    /** Lista de tipos de conteúdos com parser associado. */
    export function availableParsers() {
        const parserNames = [] as string[]

        parsers.forEach((_, contentName) => {
            parserNames.push(contentName)
        })
        return parserNames
    }

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

        const parser = parsers.get(content)
        if (!parser) {
            throw new MissingParser(content, match)
        }
        return parser(match)
    }

    /** Erros durante parsing dos resultados de busca pela API. */
    export class MissingParser extends Parser.Error<Match | any> {
        /** Descrição do conteúdo retornado. */
        readonly contentName: string

        constructor(content: string, match: any) {
            super(match, 'Match')
            Parser.Error.captureStackTrace(this, MissingParser)
            this.contentName = content

            this.message = `Nenhum parser encontrado para ${this.value}.`
                + ` Os conteúdos esperados são ${availableParsers()}.`
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
