import type { ExtractRouteParams } from 'react-router'

/** Diretório na URL da Página de Cursos. */
export const DIRECTORY = 'disciplina'
/** Caminho completo pra Página de Cursos. */
export const PATH = `/${DIRECTORY}/:code` as const

/** Parâmetro na URL para uso com 'react-router-dom'. */
export type CourseParam = ExtractRouteParams<typeof PATH, string>

/**
 *  URL da página da disciplina com o código dado.
 *
 * Exemplo: `disciplinaURL('MC102') === '/disciplina/MC102'`.
 */
export function disciplinaURL<Code extends string>(code: Code) {
    return `/${DIRECTORY}/${code}` as const
}
