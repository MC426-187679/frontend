import React from 'react'

import './Search.scss'
import { withPath } from 'modules/routes'
import { QUERY_PATH, useSearchQuery } from './params'

/** Página de Busca. */
const Search = withPath(QUERY_PATH, () => {
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
})
export default Search
