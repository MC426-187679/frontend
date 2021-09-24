import React from 'react'
import type { Location } from 'history'

import './Search.scss'
import { QUERY_PATH, extractSearchParam } from 'utils/helpers/search'
import AppPage from 'components/AppPage'

export { QUERY_PATH as SEARCH_PATH }

interface SearchProps {
    location: Location
}

/** Página de Busca. */
export default function Search({ location }: SearchProps) {
    const query = extractSearchParam(location)

    return (
        <AppPage>
            { query
                ? (
                    <div className="search-results">
                        Sem resultados para <b>{query}</b>, ainda...
                    </div>
                )
                : <div> Busque na barra acima! ;) </div> }
        </AppPage>
    )
}
