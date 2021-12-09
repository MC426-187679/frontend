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
    export function code(item: unknown): Code {
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
    function fromString(item: unknown) {
        const text = Parser.string(item, { required: false })
        const code = text.replace('*', '')
        const partial = text.includes('*')

        return {
            code: Parsing.code(code),
            partial,
        }
    }

    /** {@link Parser} para requisitos de disciplinas. */
    export function requirement(item: unknown): Requirement {
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
            Parser.assertCanBeAcessed(item)

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
    /** {@link Parser} para grupos de requisitos não vazios e sem repetição. */
    export function group(item: unknown): Requirement.Group {
        const reqGroup = Parser.distincts(item, Parsing.requirement, (req) => req.code)
        if (reqGroup.length <= 0) {
            throw new Parser.Error(reqGroup, 'Requirement.Group')
        }
        return reqGroup
    }

    /** {@link Parser} para lista de códigos sem repetição. */
    export function codes(item: unknown): Code[] {
        return Parser.distincts(item, Parsing.code, (code) => code)
    }
}

export { Parsing }
