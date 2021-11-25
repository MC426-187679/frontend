import type { RouteParams } from 'utils/params'

/** Diretório na URL da Página de Cursos. */
const PAGE_DIR = 'disciplina'

/** URL da página da disciplina com o código dado (para useo interno). */
export function url<Code extends string>(code: Code) {
    return `/${PAGE_DIR}/${code}` as const
}

/** Caminho completo pra Página de Cursos. */
export const PAGE_PATH = url(':code')

/** Parâmetro da URL para uso com 'react-router-dom'. */
export type Params = RouteParams<typeof PAGE_PATH>
