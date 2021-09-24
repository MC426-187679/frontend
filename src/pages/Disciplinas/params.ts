import { useEffect, useState } from 'react'
import type { ExtractRouteParams } from 'react-router'

import { Disciplina, parseDisciplina } from './disciplinas'

/** Diretório na URL da Página de Cursos. */
const DIRECTORY = 'disciplina'
/** Caminho completo pra Página de Cursos. */
export const PATH = `/${DIRECTORY}/:code` as const

/** Parâmetro na URL para uso com 'react-router-dom'. */
export type CourseParam = ExtractRouteParams<typeof PATH, string>

/**
 *  URL da página da disciplina com o código dado.
 *
 * Exemplo: `courseURL('MC102') === '/disciplina/MC102'`.
 */
export function disciplinaURL<Code extends string>(code: Code) {
    return `/${DIRECTORY}/${code}` as const
}

/**
 * Resultado do `fetch` da API:
 *  uma disciplina ou um erro.
 */
type Data = {
    kind: 'course'
    disc: Disciplina
} | {
    kind: 'error'
    error: any
} | {
    kind?: 'loading'
}

/**
 * Pede uma disciplina da API do backend.
 *
 * Pode resultar em erro.
 */
async function loadData(code: string): Promise<Data> {
    try {
        const response = await fetch(`/api/${DIRECTORY}/${code}`)
        const disc = parseDisciplina(await response.json())

        // acusa erro de parsing
        if (!disc) {
            throw new Error(`JSON inválido: ${disc}`)
        }
        return { kind: 'course', disc }

    // em caso de erro, retorna ele
    } catch (error: any) {
        return { kind: 'error', error }
    }
}

/**
 *  Hook que recupera o código da disciplina
 * pela URL, recupera os dados do backend
 * e retorna o resultado.
 *
 *  Retorna 'undefined' enquanto oa API não
 * responde, mas depois retorna a resposta,
 * que pode ser a disciplina ou um erro.
 */
export function useDisciplina(code: string) {
    // dados da API
    const [data, setData] = useState<Data>({ })

    // carrega da API e atualiza o 'data'
    useEffect(() => {
        setData({ })
        loadData(code).then(setData)
    }, [code])

    return data
}
