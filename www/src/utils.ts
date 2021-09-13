export interface Course {
    code: string
    name: string
    req: {
        code: string
        special: boolean
        partial: boolean
    }[][]
    reqBy: string[]
}

export interface JSONCourse extends Omit<Course, 'req' | 'reqBy'> {
    req: string[][]
}


export function normalize(text: string) {
    return text.normalize('NFKD')
        .replace(/[\u0300-\u036F]/g, '')
}

export function uniques<T>(arr: T[]) {
    return arr.sort().flatMap((item, idx) => {
        if (arr[idx-1] === item) {
            return []
        } else {
            return [item]
        }
    })
}

export function parseNum(value: any): number | undefined {
    switch (typeof value) {
        case 'string':
            return parseInt(value, 10)
        case 'number':
            return value
        case 'bigint':
            return Number(value)
        default:
            return undefined
    }
}

export function simplify({name, code, req}: Course): JSONCourse {
    return {
        name, code,
        req: req.map(block => block.map(({code, partial}) => `${partial?'*':''}${code}`))
    }
}
