import { Parser } from 'utils/parsing'
import * as Discipline from 'features/discipline'

import type { Course, Tree } from '../types/course'

namespace Parsing {
    /** Regex para verificação de códigos de cursos. */
    const validCode = /^[1-9][0-9]?$/

    /** Checa se a string é um código de curso válido. */
    export function isCode(value: string): value is Course.Code {
        return validCode.test(value)
    }

    /** {@link Parser} de código de curso. */
    export function code(item: unknown): Course.Code {
        const text = Parser.string(item, { required: true })

        if (isCode(text)) {
            return text
        } else {
            throw new Parser.Error(text, 'Course.code')
        }
    }
}

namespace Parsing {
    const validCode = /^[A-Z][A-Z]$/

    export function isVariantCode(item: unknown): item is Course.Variant.Code {
        return typeof item === 'string'
            && validCode.test(item)
    }

    export function variant(item: unknown): Course.Variant {
        Parser.assertCanBeAcessed(item)
        const name = Parser.string(item.name, { required: true })

        if (isVariantCode(item.code) && name) {
            return { code: item.code, name }
        } else {
            throw new Parser.Error(item, 'Course.variants')
        }
    }
}

namespace Parsing {
    function discipline(item: unknown): Tree.DisciplinePreview {
        Parser.assertCanBeAcessed(item)
        const code = Discipline.Parsing.code(item.code)
        const credits = Parser.positiveInt(item.credits, { required: true })

        return { code, credits }
    }

    type UnnamedSemester = Omit<Tree.Semester, 'name' | 'index'>

    function semester(item: unknown): UnnamedSemester {
        Parser.assertCanBeAcessed(item)
        const disciplines = Parser.distincts(item.disciplines, discipline, (disc) => disc.code)
        const electives = Parser.positiveInt(item.electives, { defaultsTo: undefined })

        const required = disciplines.reduce((sum, { credits }) => sum + credits, 0)
        const total = required + (electives ?? 0)

        return { disciplines, electives, credits: { required, total } }
    }

    type SemesterItem = {
        indexes: number[]
        disciplines: UnnamedSemester
    }

    function nameSemester({ indexes, disciplines }: SemesterItem): Tree.Semester {
        const ordinals = indexes.map((index) => `${index + 1}°`)
        const lastIndex = ordinals.pop() ?? ''

        const firstIndexes = ordinals.join(', ')
        if (firstIndexes) {
            return {
                ...disciplines,
                name: `${firstIndexes} e ${lastIndex} Semestres`,
                index: indexes,
            }
        } else {
            return {
                ...disciplines,
                name: `${lastIndex} Semestre`,
                index: indexes.pop() ?? 0,
            }
        }
    }

    export function semesters(item: unknown): Tree.Semester[] {
        const unnamed = Parser.array(item, semester, { required: true })
        const allSemesters: Tree.Semester[] = []

        let currentItem: undefined | SemesterItem
        unnamed.forEach((disciplines, index) => {
            if (disciplines.credits.total <= 0) {
                currentItem?.indexes.push(index)
            } else {
                if (currentItem !== undefined) {
                    allSemesters.push(nameSemester(currentItem))
                }
                currentItem = {
                    indexes: [index],
                    disciplines,
                }
            }
        })

        if (currentItem !== undefined) {
            allSemesters.push(nameSemester(currentItem))
        }
        return allSemesters
    }
}

export { Parsing }
