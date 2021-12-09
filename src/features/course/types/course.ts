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
        readonly code: `${UppercaseAscii}${UppercaseAscii}`
        readonly name: string
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

export interface Tree extends ReadonlyArray<Tree.Semester> { }

export namespace Tree {
    export type Index = Digit | string

    export interface DisciplinePreview {
        readonly code: Discipline.Code
        readonly credits: number
    }

    export interface Semester {
        readonly disciplines: readonly DisciplinePreview[]
        readonly electives: number
    }

    export function parse(item: unknown): Tree {
        return Parser.array(item, Parsing.semester, { required: true })
    }

    export function pagePath<C extends string, I extends Index>(code: C, variant: I) {
        return variantUrl(code, variant)
    }

    export function loadPath<C extends string, I extends Index>(code: C, variant: I) {
        return `/api/curso/${code}/${variant}` as const
    }

    export async function fetch([code, variant]: [string, Index], init?: RequestInit) {
        return parse(await Fetch.json(loadPath(code, variant), init))
    }
}
