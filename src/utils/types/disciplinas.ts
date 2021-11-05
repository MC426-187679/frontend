import { parseArray, parseString } from 'utils/helpers/parsing'

/**
 *  Outra disciplina que deve ser completo
 * antes de uma dada discipliana que requer
 * ele.
 */
export interface Requisito {
    /** Código do curso ou requisito. */
    readonly code: string
    /**
     *  Sé o código representa um requerimento
     * especial em vez de uma disciplina
     * propriamente.
     */
    readonly special: boolean
    /** Deve ser feita, mas não necessariamente concluída. */
    readonly partial: boolean
}

/**
 *  Um grupo de requisitos que devem ser
 * atendidos juntos (conjunção lógica).
 */
export type GrupoDeRequisitos = ReadonlyArray<Requisito>

/** Dados que representam uma Disciplina. */
export interface Disciplina {
    /** Identificador no formato: `[A-Z][A-Z ][0-9]{3}` */
    readonly code: string
    /** Nome da matéria / disciplina. */
    readonly name: string
    /**
     *  Um lista de grupos de requisitos onde cada
     * grupo libera o acesso à disciplina quando
     * completo.
     */
    readonly reqs: ReadonlyArray<GrupoDeRequisitos>
    /** Lista de disciplina que têm esta como requisito. */
    readonly reqBy: ReadonlyArray<string>
}

/**
 * Parseia um objeto como requisito de disciplina.
 *
 * Retorna um código 'XXYYY' em caso de erro.
 */
function parseRequisito(item: any) {
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
    return requirement as Requisito
}

/**
 * Tenta parsear um objeto como uma disciplina.
 *
 * @param course objeto qualquer
 * @returns dados de uma disciplina
 *
 * @throws {@link ParsingError} se o objeto não
 *  tem os campos `code` e `name`
 */
export function parseDisciplina(course: any) {
    // precisa de pelo menos código e nome
    const code = parseString(course.code, { required: true })
    const name = parseString(course.name, { required: true })

    // parseia requisitos ou retorna lista vazia
    const reqs = parseArray(course.reqs, (group) => (
        parseArray(group, parseRequisito)
    ))
    // parseia reqBy, removendo strings inválidas
    const reqBy = parseArray(course.reqBy, (group) => (
        parseString(group, { required: true })
    ))

    return { code, name, reqs, reqBy } as Disciplina
}
