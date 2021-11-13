import type { ExtractRouteParams, match } from 'react-router'

/** Diretório na URL da Página de Cursos. */
const PAGE_DIR = 'disciplina'
/** Caminho completo pra Página de Cursos. */
export const PAGE_PATH = `/${PAGE_DIR}/:code` as const

/** Parâmetro da URL para uso com 'react-router-dom'. */
export type Params = ExtractRouteParams<typeof PAGE_PATH, string>
/** Match do 'react-router-dom' para a página de disciplinas. */
export type MatchParams = match<Params>

/**
 *  URL da página da disciplina com o código dado.
 *
 * Exemplo: `disciplineURL('MC102') === '/disciplina/MC102'`.
 */
export function disciplineURL<Code extends string>(code: Code) {
    return `/${PAGE_DIR}/${code}` as const
}
