import React from 'react'

import { QUERY_PATH, useSearchQuery } from './searchParams'
import './Search.scss'
// reexport for main app
export { QUERY_PATH as SEARCH_PATH }

/** Search Page. */
export default function Search() {
    const query = useSearchQuery()

    if (query) {
        return (
            <div className="search-results">
                Sem resultados para <b>{query}</b>, ainda...
            </div>
        )
    } else {
        return (
            <div>
                Busque na barra acima! ;)
            </div>
        )
    }
}
