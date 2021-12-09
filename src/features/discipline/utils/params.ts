/** Diretório na URL da Página de Disciplinas. */
const PAGE_DIR = 'disciplina'

/** URL da página da disciplina com o código dado (para useo interno). */
export function url<Code extends string>(code: Code) {
    return `/${PAGE_DIR}/${code}` as const
}

/** Caminho completo pra Página de Disciplinas. */
export const PAGE_PATH = url(':code')
