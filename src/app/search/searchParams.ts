import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

/** Path for Search Page. */
export const QUERY_PATH = '/busca'
/** URL Param for searching. */
export const QUERY_PARAM = 'q'

/**
 *  Hook for extracting current query
 * string on search page.
 */
export function useSearchQuery() {
    const { pathname, search } = useLocation()

    const currentQuery = useMemo(
        () => {
            if (pathname !== QUERY_PATH) {
                return undefined
            }

            const params = new URLSearchParams(search)
            return params.get(QUERY_PARAM) ?? undefined
        },
        [pathname, search],
    )
    return currentQuery
}
