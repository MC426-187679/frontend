/** Diretório na URL da Página de Cursos. */
const PAGE_DIR = 'curso'

/** URL da página do curso com o código dado (para uso interno). */
export function courseUrl<Code extends string>(code: Code) {
    return `/${PAGE_DIR}/${code}` as const
}

export function variantUrl<Code extends string, Variant extends string | number>(
    code: Code,
    variant: Variant,
) {
    return `/${PAGE_DIR}/${code}/${variant}` as const
}

/** Caminho completo pra Página de Cursos. */
export const COURSE_PAGE_PATH = courseUrl(':code')
