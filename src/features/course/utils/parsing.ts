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

interface Semester {
    disciplines: Tree.DisciplinePreview[]
    electives?: number | undefined
    credits: {
        required: number
        total: number
    }
}

namespace Semester {
    function parseDiscipline(item: unknown): Tree.DisciplinePreview {
        Parser.assertCanBeAcessed(item)
        const code = Discipline.Parsing.code(item.code)
        const credits = Parser.positiveInt(item.credits, { required: true })

        return { code, credits }
    }

    function parseSemester(item: unknown): Semester {
        Parser.assertCanBeAcessed(item)
        const disciplines = Parser.distincts(
            item.disciplines,
            parseDiscipline,
            (disc) => disc.code,
        )
        const electives = Parser.positiveInt(item.electives, { defaultsTo: undefined })

        const required = disciplines.reduce((sum, { credits }) => sum + credits, 0)
        const total = required + (electives ?? 0)

        return { disciplines, electives, credits: { required, total } }
    }

    export interface Group extends Semester {
        indexes: number[]
    }

    export function parseGroup(item: unknown): Group[] {
        const semesters = Parser.array(item, parseSemester, { required: true })

        const groups: Group[] = []
        semesters.forEach((semester, index) => {
            if (semester.credits.total <= 0) {
                groups[groups.length - 1]?.indexes.push(index)
            } else {
                groups.push({ ...semester, indexes: [index] })
            }
        })
        return groups
    }
}

namespace Parsing {
    function nameSemester(indexes: number[]) {
        const ordinals = indexes.map((index) => `${index + 1}°`)

        const lastIndex = ordinals.pop() ?? ''
        const firstIndexes = ordinals.join(', ')
        if (firstIndexes) {
            return `${firstIndexes} e ${lastIndex} Semestres`
        } else if (lastIndex) {
            return `${lastIndex} Semestre`
        } else {
            return 'Semestre'
        }
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    function findMinimumPerSemester(credits: number[], semesterCount: number) {
        return credits.reduce((sum, value) => sum + value, 0)
    }

    function parseGroup(group: Semester.Group): Tree.SemesterGroup {
        const name = nameSemester(group.indexes)
        const minimumPerSemester = findMinimumPerSemester(
            group.disciplines.map((discipline) => discipline.credits),
            group.indexes.length,
        )

        const credits = { ...group.credits, minimumPerSemester }
        return Object.assign(group, { name, credits })
    }

    export function semesterGroups(item: unknown): Tree.SemesterGroup[] {
        return Semester.parseGroup(item).map(parseGroup)
    }
}

export { Parsing }
