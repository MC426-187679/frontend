import React from 'react'

import { QUERY_PATH, useSearchQuery } from './params'
import './Search.scss'
// reexporta pro App principal
export { QUERY_PATH as SEARCH_PATH }

/** Página de Busca. */
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
