import Fuse from 'fuse.js'
import { Course, JSONCourse, normalize, uniques } from './utils'
import { loadCourses } from './course'


function insertDependents(deps: Map<string, string[]>, code: string, req: {code: string}[][]) {
    const requires = uniques(req.flatMap(item => item))

    for (const dep of requires) {
        const depList = deps.get(dep.code)
        if (depList) {
            depList.push(code)
        }
    }
}

function parseCode(code: string) {
    const [init, rem] = code.split('*', 2)
    if (rem) {
        return { code: rem, partial: true }
    } else {
        return { code: init, partial: false }
    }
}

function insertReqBy(json: JSONCourse[]) {
    const dependents = new Map(json.map(course => {
        return [course.code, [] as string[]]
    }))

    const courses = json.map(({code, name, req}) => {
        const requirements = req.map(dep => dep.map(parseCode))

        insertDependents(dependents, code, requirements)
        return { code, name, req: requirements }
    })

    return courses.map(({ code, name, req }) => {
        const reqBy = uniques(dependents.get(code) ?? [])

        const requ = req.map(deps => deps.map(reqCode => {
            const special = !dependents.has(reqCode.code)
            return Object.assign(reqCode, { special })
        }))
        return { code, name, req: requ, reqBy } as Course
    })
}

function fuseCourses(courses: ReadonlyArray<Course>) {
    return new Fuse(courses, {
        keys: [
            { name: 'code', weight: 80 },
            { name: 'name', weight: 20 }
        ],
        isCaseSensitive: false,
        ignoreLocation: true,
        minMatchCharLength: 3,
        threshold: 0.4,
        getFn: (course, key) => {
            return normalize(course[key as 'name' | 'code'])
        }
    })
}

function fuseCodes(courses: ReadonlyArray<Course>) {
    return new Fuse(courses, {
        keys: ['code'],
        isCaseSensitive: false,
        minMatchCharLength: 2,
        threshold: 0.4,
    })
}

function extractItem<T>(match: Fuse.FuseResult<T>): T {
    return match.item
}

interface Options {
    limit?: number | undefined
    code: boolean
}

export class Searcher {
    readonly fuse: Fuse<Course>
    readonly codes: Fuse<Course>
    readonly courses: Map<string, Course>

    constructor(path = 'disciplinas') {
        const courses = insertReqBy(loadCourses(path))

        this.fuse = fuseCourses(courses)
        this.codes = fuseCodes(courses)
        this.courses = new Map(courses.map(course => [course.code, course]))
    }

    search(query: string, codes?: boolean, limit?: number | undefined) {
        const options = {} as Fuse.FuseSearchOptions
        if (limit !== undefined) {
            options.limit = limit
        }

        if (codes) {
            return this.codes.search(query, options)
                .map(extractItem)
        } else {
            return this.fuse.search(query, options)
                .map(extractItem)
        }
    }

    find(code: string) {
        return this.courses.get(code)
    }

    allCourses() {
        return this.courses.values()
    }

    allCodes() {
        return this.courses.keys()
    }
}
