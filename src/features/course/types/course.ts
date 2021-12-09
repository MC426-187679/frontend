import { Fetch } from 'utils/fetching'
import { Parser } from 'utils/parsing'
import type { Digit, LeadingDigit, UppercaseAscii } from 'types/basic'

import { Matcher } from 'features/search'
import type * as Discipline from 'features/discipline'

import { Parsing } from '../utils/parsing'
import { courseUrl, variantUrl } from '../utils/params'
import CourseMatch from '../utils/match'

export interface Course {
    readonly code: Course.Code
    readonly name: string
    readonly variants: readonly Course.Variant[]
}

export namespace Course {
    // registra o matcher antes de qualquer possibilidade de uso do tipo
    Matcher.register(CourseMatch)

    /** Código do curso: dois dígitos, sem zeros à esquerda. */
    export type Code = `${LeadingDigit}` | `${LeadingDigit}${Digit}`

    export interface Variant {
        readonly code: Variant.Code
        readonly name: string
    }

    export namespace Variant {
        /* eslint-disable-next-line @typescript-eslint/no-shadow */
        export type Code = `${UppercaseAscii}${UppercaseAscii}`
    }

    export function parse(item: unknown): Course {
        Parser.assertCanBeAcessed(item)
        const code = Parsing.code(item.code)
        const name = Parser.string(item.name, { required: true })
        const variants = Parser.array(item.variants, Parsing.variant, { required: true })

        return { code, name, variants }
    }

    export function pagePath<C extends string>(code: C) {
        return courseUrl(code)
    }

    export function loadPath<C extends string>(code: C) {
        return `/api/curso/${code}` as const
    }

    export async function fetch(code: string, init?: RequestInit) {
        return parse(await Fetch.json(loadPath(code), init))
    }
}

export interface Tree extends ReadonlyArray<Tree.Semester> {
    readonly credits: {
        readonly max: number
        readonly total: number
    }
}

export namespace Tree {
    export type VariantCode = Course.Variant.Code | 'arvore'

    export interface DisciplinePreview {
        readonly code: Discipline.Code
        readonly credits: number
    }

    export interface Semester {
        readonly disciplines: readonly DisciplinePreview[]
        readonly electives?: number | undefined
        readonly credits: {
            readonly required: number
            readonly total: number
        }
        readonly name: string
        readonly index: number | readonly number[]
    }

    export function parse(item: unknown): Tree {
        const semesters = Parsing.semesters(item)

        const max = semesters.reduce(
            (maximum, { credits: { total } }) => {
                return (total > maximum) ? total : maximum
            },
            0,
        )
        const total = semesters.reduce((sum, { credits }) => sum + credits.total, 0)

        return Object.assign(semesters, { credits: { max, total } })
    }

    export function pagePath<C extends string, I extends string>(code: C, variant: I) {
        return variantUrl(code, variant)
    }

    export function loadPath<C extends string, I extends string>(code: C, variant: I) {
        return `/api/curso/${code}/${variant}` as const
    }

    export async function fetch([code, variant]: [string, string], init?: RequestInit) {
        return parse(await Fetch.json(loadPath(code, variant), init))
    }
}
