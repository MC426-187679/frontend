import { Parser } from 'utils/parsing'
import { Space } from 'utils/string'

import type { Code, Requirement } from '../types/discipline'

namespace Parsing {
    /** Regex para verificação de códigos de disciplinas. */
    const validCode = /^[A-Z][A-Z\u00A0][0-9][0-9][0-9]$/ // TODO: testar regex

    /** Checa se a string é um código de discplina válido. */
    export function isCode(value: string): value is Code {
        return validCode.test(value)
    }

    /** {@link Parser} de código de disciplian. */
    export function code(item: any): Code {
        const text = Parser.string(item, { required: true })
        const value = Space.withNonBreaking(text.toUpperCase())

        if (isCode(value)) {
            return value
        } else {
            throw new Parser.Error(value, 'Discipline.code')
        }
    }
}

namespace Parsing {
    /** {@link Parser} de código de disciplina com marcador `*` de requisito parcial. */
    function fromString(item: any) {
        const text = Parser.string(item, { required: false })
        const code = text.replace('*', '')
        const partial = text.includes('*')

        return {
            code: Parsing.code(code),
            partial,
        }
    }

    /** {@link Parser} para requisitos de disciplinas. */
    export function requirement(item: any): Requirement {
        // requisito recebido apenas pelo código
        if (typeof item === 'string') {
            const { code, partial } = fromString(item)
            return {
                code,
                partial,
                special: false,
            }
        // requisito recebido como objeto
        } else {
            const { code, partial } = fromString(item.code)
            return {
                code,
                partial: partial || Boolean(item.partial),
                special: Boolean(item.special),
            }
        }
    }
}

namespace Parsing {
    /** Objeto para comparação de texto insensitivo. */
    const collator = new Intl.Collator('pt-BR', {
        usage: 'sort',
        sensitivity: 'base',
        ignorePunctuation: true,
        numeric: false,
        caseFirst: 'upper',
    })

    /** Ordena o vetor e retorna os elementos com chaves distintas. */
    function distincts<T>(array: T[], key: (item: T) => string) {
        array.sort((a, b) => collator.compare(key(a), key(b)))

        let lastKey = ''
        const uniques = array.flatMap((item) => {
            if (collator.compare(key(item), lastKey) === 0) {
                return []
            } else {
                lastKey = key(item)
                return [item]
            }
        })
        return uniques
    }

    /** {@link Parser} para grupos de requisitos não vazios e sem repetição. */
    export function group(item: any): Requirement.Group {
        const reqs = Parser.array(item, Parsing.requirement)
        const reqGroup = distincts(reqs, (req) => req.code)
        if (reqGroup.length <= 0) {
            throw new Parser.Error(reqGroup, 'Requirement.Group')
        }
        return reqGroup
    }

    /** {@link Parser} para lista de códigos sem repetição. */
    export function codes(item: any): Code[] {
        const data = Parser.array(item, Parsing.code)
        return distincts(data, (code) => code)
    }
}

export { Parsing }
