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
    readonly req: ReadonlyArray<GrupoDeRequisitos>
    /** Lista de disciplina que têm esta como requisito. */
    readonly reqBy: ReadonlyArray<string>
}

/**
 * Parseia um objeto como vetor genérico.
 *
 * Retorna um vetor vazio em vez de dar erro.
 */
function asArray(item: any) {
    if (Array.isArray(item)) {
        return item
    } else {
        return []
    }
}

/**
 * Parseia um objeto como requisito de disciplina.
 *
 * Retorna um código 'XXYYY' em caso de erro.
 */
function parseRequisito(item: Requisito | any) {
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
 * @returns uma disciplina se o objeto tem pelo
 *  menos os campos `code` e `name`, ou
 * `undefined` caso contrário
 */
export function parseDisciplina(course: Disciplina | any) {
    const { code, name } = course

    // precisa de pelo menos código e nome
    if (typeof code !== 'string' || code === '') {
        return undefined
    } else if (typeof name !== 'string' || name === '') {
        return undefined
    }
    // requisitos são tidos como um lista vazia
    // se não existir
    const req = asArray(course.req).map(group => (
        asArray(group).map(parseRequisito)
    ))
    const reqBy = asArray(course.reqBy)
        .filter(item => typeof item === 'string')

    return { code, name, req, reqBy } as Disciplina
}
