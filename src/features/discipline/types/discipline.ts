import { Fetch } from 'utils/fetching'
import { Parser } from 'utils/parsing'
import { Space } from 'utils/string'

import { Parsing } from '../utils/parsing'

// Símbolo especial para fazer com que `Code` seja diferente de `string`.
declare const validCode: unique symbol

/** Código de uma disciplina, no formato `[A-Z][A-Z ][0-9][0-9][0-9]`. */
export type Code = string & {
    [validCode]: never
}

/**
 *  Outra disciplina que deve ser completo antes de uma dada discipliana que requer ele.
 */
export interface Requirement {
    /** Código do curso ou requisito. */
    readonly code: Code
    /** Sé o código representa um requerimento especial em vez de uma disciplina propriamente. */
    readonly special: boolean
    /** Deve ser feita, mas não necessariamente concluída. */
    readonly partial: boolean
}

export namespace Requirement {
    /**
     *  Um grupo de requisitos que devem ser atendidos juntos (conjunção lógica).
     */
    export type Group = ReadonlyArray<Requirement>
}

/** Dados que representam uma Disciplina. */
export interface Discipline {
    /** Identificador no formato: `[A-Z][A-Z ][0-9][0-9][0-9]` */
    readonly code: Code
    /** Nome da matéria / disciplina. */
    readonly name: string
    /** Ementa da discplina. */
    readonly syllabus: string
    /** Carga horária semanal. */
    readonly credits: number
    /**
     *  Um lista de grupos de requisitos onde cada grupo libera o acesso à disciplina
     * quando completo.
     */
    readonly reqs: ReadonlyArray<Requirement.Group>
    /** Lista de disciplina que têm esta como requisito. */
    readonly reqBy: ReadonlyArray<Code>
}

export namespace Discipline {
    /**
     * Tenta parsear um objeto como uma disciplina.
     *
     * @param course objeto qualquer
     * @returns dados de uma disciplina
     *
     * @throws {@link Parser.Error} se o objeto não tem os campos obrigatórios.
     */
    export function parse(course: any): Discipline {
        // precisa de código, nome, ementa e créditos
        const code = Parsing.code(course.code)
        const name = Parser.string(course.name, { required: true })
        const syllabus = Parser.string(course.syllabus, { required: true })
        const credits = Parser.positiveInt(course.credits, { required: true })
        // parseia requisitos ou retorna lista vazia
        const reqs = Parser.array(course.reqs, Parsing.group)
        // parseia reqBy, removendo strings inválidas
        const reqBy = Parsing.codes(course.reqBy)
        return { code, name, syllabus, credits, reqs, reqBy }
    }

    /**
     * Constrói URL da API para recuperar dados da disciplina.
     *
     * @param code códido da disciplina a ser recuperada
     * @returns URL da API RESTful
     */
    export function urlFor<C extends Code | string>(code: C) {
        return `/api/disciplina/${Space.restore(code)}` as const
    }

    /**
     * Requisita e parseia disciplina da API.
     *
     * @param code URL da requisição.
     * @param init Opções de requisição do {@link fetchJson}.
     * @returns Promessa com a disciplina.
     *
     * @throws Erros do {@link fetchJson} ou do {@link Discipline.parser}.
     */
    export async function fetch(code: string, init?: RequestInit) {
        return parse(await Fetch.json(urlFor(code), init))
    }
}
