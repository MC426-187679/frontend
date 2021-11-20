import { Parser } from 'utils/parsing'

import type { Match } from './match'

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
        return Array.from(matchers.values())
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
    export function parse(match: unknown) {
        Parser.assertCanBeAcessed(match)

        const content = Parser.string(match.content, { required: true })

        const matcher = matchers.get(content)
        if (!matcher) {
            throw new MissingParser(content)
        }

        return matcher.parse(match)
    }
}

/** Erros durante parsing dos resultados de busca pela API. */
export class MissingParser extends Parser.Error<string> {
    constructor(content: string) {
        super(content, 'Match')

        const parsers = Matcher.available().map((matcher) => matcher.content)
        this.message = `Nenhum parser encontrado para ${content}.`
            + ` Os conteúdos esperados são ${parsers.join(',')}.`
    }
}
