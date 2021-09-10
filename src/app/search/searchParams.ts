import { useLocation } from 'react-router-dom'
import type { Location } from 'history'

/** Path for Search Page. */
export const QUERY_PATH = '/busca'
/** URL Param for searching. */
export const QUERY_PARAM = 'q'

/**
 * Extract search query from a URL Location.
 *
 *  Returns `undefined` if URL does not match
 * the search page or if no query is given.
 */
export function extractSearchParam<S>({ pathname, search }: Location<S>) {
    if (pathname !== QUERY_PATH) {
        return undefined
    }

    const params = new URLSearchParams(search)
    return params.get(QUERY_PARAM) ?? undefined
}

/**
 *  Hook for extracting current query
 * string on search page.
 *
 * {@see extractSearchParam}
 */
export function useSearchQuery() {
    const location = useLocation()
    return extractSearchParam(location)
}
