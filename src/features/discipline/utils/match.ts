import { Parser } from 'utils/parsing'
import { Match } from 'features/search'

import { disciplineURL } from './params'

/** Resultado  de disciplina. */
export default class DisciplineMatch extends Match {
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
