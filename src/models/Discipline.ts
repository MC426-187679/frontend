import { Parser } from 'utils/parsing'
import { fetchJson } from 'utils/fetching'

/**
 *  Outra disciplina que deve ser completo antes de uma dada discipliana que requer ele.
 */
export interface Requirement {
    /** Código do curso ou requisito. */
    readonly code: string
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

    /**
     * Parseia um objeto como requisito de disciplina.
     *
     * Retorna um código 'XXYYY' em caso de erro.
     */
    export function parser(item: any): Requirement {
        const { code, special, partial } = item
        const requirement = {
            code: 'XXYYY',
            special: Boolean(special),
            partial: Boolean(partial),
        }

        // requisito recebido de forma correta
        if (typeof code === 'string' && code !== '') {
            requirement.code = code
        // requisito é apenas o código
        } else if (typeof item === 'string' && item !== '') {
            requirement.code = item.replace('*', '')
            requirement.partial = item.includes('*')
        }
        return requirement
    }
}

/** Dados que representam uma Disciplina. */
export interface Discipline {
    /** Identificador no formato: `[A-Z][A-Z ][0-9]{3}` */
    readonly code: string
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
    readonly reqBy: ReadonlyArray<string>
}

export namespace Discipline {
    /**
     * Tenta parsear um objeto como uma disciplina.
     *
     * @param course objeto qualquer
     * @returns dados de uma disciplina
     *
     * @throws {@link Parser.Error} se o objeto não tem os campos `code` e `name`
     */
    export function parser(course: any): Discipline {
        // precisa de código, nome, ementa e créditos
        const code = Parser.string(course.code, { required: true })
        const name = Parser.string(course.name, { required: true })
        const syllabus = Parser.string(course.syllabus, { required: true })
        const credits = Parser.int(course.credits, { required: true })

        // parseia requisitos ou retorna lista vazia
        const reqs = Parser.array(course.reqs, (group) => (
            Parser.array(group, Requirement.parser)
        ))
        // parseia reqBy, removendo strings inválidas
        const reqBy = Parser.array(course.reqBy, (group) => (
            Parser.string(group, { required: true })
        ))
        return { code, name, syllabus, credits, reqs, reqBy }
    }

    /**
     * Constrói URL da API para recuperar dados da disciplina.
     *
     * @param code códido da disciplina a ser recuperada
     * @returns URL da API RESTful
     */
    export function urlFor<Code extends string>(code: Code) {
        return `/api/disciplina/${code}` as const
    }

    /**
     * Requisita e parseia disciplina da API.
     *
     * @param code URL da requisição.
     * @returns Promessa com a disciplina.
     *
     * @throws Erros do {@link fetchJson} ou do {@link Discipline.parser}.
     */
    export async function fetch(code: string) {
        return parser(await fetchJson(urlFor(code)))
    }
}
