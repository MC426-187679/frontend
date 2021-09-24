import { useLocation } from 'react-router-dom'
import type { Location } from 'history'

/** Cominho para a Página de Busca. */
export const QUERY_PATH = '/busca'
/** Parâmetro de busca na URL. */
export const QUERY_PARAM = 'q'

/**
 * Extrai string de busca do valor da URL.
 *
 *  Returna `undefined` se a URL não bate com
 * a página de busca ou se nenhuma string de
 * busca é dada.
 */
export function extractSearchParam<S>({ pathname, search }: Location<S>) {
    if (pathname !== QUERY_PATH) {
        return undefined
    }

    const params = new URLSearchParams(search)
    return params.get(QUERY_PARAM) ?? undefined
}
