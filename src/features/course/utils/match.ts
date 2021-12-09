import { Parser } from 'utils/parsing'
import { Match } from 'features/search'

import { courseUrl } from './params'

/** Resultado de curso. */
export default class CourseMatch extends Match {
    /** Código do curso. */
    readonly code: string
    /** Nome do curso. */
    readonly name: string

    constructor(code: string, name: string) {
        super()

        this.code = code
        this.name = name
    }

    /** O código do curso, único entre os resultados da busca. */
    uniqueMatchIdentifier() {
        return this.code
    }

    /** Descrição no formato `NOME (CÓDIGO)`. */
    uniqueMatchDescription() {
        return `${this.name} (${this.code})` as const
    }

    /** URL para acesso da disciplina. */
    asUrl() {
        return courseUrl(this.code)
    }

    /** Seletor de resultados de busca como curso. */
    static readonly content = 'course'

    /** Parser de resultado de busca como disciplina. */
    static parse(item: unknown) {
        Parser.assertCanBeAcessed(item)

        const code = Parser.string(item.code, { required: true })
        const name = Parser.string(item.name, { required: true })
        return new CourseMatch(code, name)
    }
}
