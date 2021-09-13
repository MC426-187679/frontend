import { readdirSync, readFileSync } from 'fs'
import { JSONCourse, uniques } from './utils'


function parseStr(item: any) {
    if (typeof item === 'string') {
        return item
    }
    throw new Error('invalid string')
}

function parseArray<T>(item: any, parser: (item: any) => T) {
    if (Array.isArray(item)) {
        return item.map(parser)
    }
    throw new Error('invalid array')
}

function parseRequirements(req: any) {
    try {
        const arrays = parseArray(req, item => {
            return uniques(parseArray(item, parseStr))
        })

        const requirements = arrays.filter(item => item.length > 0)
        if (requirements.length > 0) {
            return uniques(requirements)
        } else {
            return []
        }
    } catch {
        return []
    }
}

function parseCourse({ code, name, req }: any): JSONCourse {
    return {
        code: parseStr(code).toUpperCase(),
        name: parseStr(name),
        req: parseRequirements(req),
    }
}

export function loadCourses(path: string) {
    const filenames = readdirSync(path)

    const files = filenames.flatMap(file => {
        const data = readFileSync(`${path}/${file}`, { encoding: 'utf8' })
        return parseArray(JSON.parse(data), parseCourse)
    })
    return files
}
