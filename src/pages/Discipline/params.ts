import type { ExtractRouteParams, match } from 'react-router'
import { Match, Matcher } from 'models/match'
import { Parser } from 'utils/parsing'

/** Diretório na URL da Página de Cursos. */
const PAGE_DIR = 'disciplina'
/** Caminho completo pra Página de Cursos. */
export const PAGE_PATH = `/${PAGE_DIR}/:code` as const

/** Parâmetro da URL para uso com 'react-router-dom'. */
export type Params = ExtractRouteParams<typeof PAGE_PATH, string>
/** Match do 'react-router-dom' para a página de disciplinas. */
export type MatchParams = match<Params>

/**
 *  URL da página da disciplina com o código dado.
 *
 * Exemplo: `disciplineURL('MC102') === '/disciplina/MC102'`.
 */
export function disciplineURL<Code extends string>(code: Code) {
    return `/${PAGE_DIR}/${code}` as const
}

/** Match de disciplina. */
class DisciplineMatch extends Match {
    /** Código da disciplina. */
    readonly code: string
    /** Nome da disciplina. */
    readonly name: string

    constructor(code: string, name: string) {
        super()

        this.code = code
        this.name = name
    }

    /** O código da disciplina, único entre os resultados da busca. */
    uniqueMatchIdentifier() {
        return this.code
    }

    /** Descrição no formato `CÓDIGO - NOME`. */
    uniqueMatchDescription() {
        return `${this.code} - ${this.name}` as const
    }

    /** URL para acesso da disciplina. */
    asUrl() {
        return disciplineURL(this.code)
    }

    /** Seletor de resultados de busca como disciplina. */
    static readonly content = 'discipline'

    /** Parser de resultado de busca como disciplina. */
    static parse(item: any) {
        const code = Parser.string(item.code, { required: true })
        const name = Parser.string(item.name, { required: true })
        return new DisciplineMatch(code, name)
    }
}
Matcher.register(DisciplineMatch)
