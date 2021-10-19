import type { Location } from 'history'

/** Cominho para a Página de Busca. */
export const PAGE_PATH = '/busca'
/** Parâmetro de busca na URL. */
const QUERY_PARAM = 'q'

/** Dados passados na URL para um consulta. */
export interface QueryParams {
    /** Texto da consulta. */
    [QUERY_PARAM]?: string | undefined
}

/**
 * Extrai parâmtetros de busca da URL.
 */
export function extractSearchParam({ pathname, search }: Location): QueryParams {
    if (pathname !== PAGE_PATH) {
        return {}
    }
    const params = new URLSearchParams(search)
    return {
        [QUERY_PARAM]: params.get(QUERY_PARAM) ?? undefined,
    }
}

/**
 * Constrói URL com parâmetros de busca.
 */
export function searchURL(params?: QueryParams) {
    const { q } = params ?? {}

    if (q) {
        return `${PAGE_PATH}?${QUERY_PARAM}=${q}` as const
    } else {
        return PAGE_PATH
    }
}
