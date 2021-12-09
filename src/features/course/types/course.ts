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

export interface Tree extends ReadonlyArray<Tree.Semester> { }

export namespace Tree {
    export type VariantCode = Course.Variant.Code | 'arvore'

    export interface DisciplinePreview {
        readonly code: Discipline.Code
        readonly credits: number
    }

    export interface Semester {
        readonly disciplines: readonly DisciplinePreview[]
        readonly electives?: number | undefined
    }

    namespace Semester {
        export function totalCredits({ disciplines, electives = 0 }: Semester) {
            const required = disciplines.reduce((sum, { credits }) => sum + credits, 0)
            return required + electives
        }
    }

    export function maxCredits(tree: Tree) {
        return tree.reduce(
            (maximum, semester) => {
                const credits = Semester.totalCredits(semester)
                return (credits > maximum) ? credits : maximum
            },
            0,
        )
    }

    export function parse(item: unknown): Tree {
        return Parser.array(item, Parsing.semester, { required: true })
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
