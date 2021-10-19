import React from 'react'
import type { Location } from 'history'

import './Page.scss'
import AppPage from 'components/layout/AppPage'

import { PAGE_PATH, extractSearchParam } from './params'

interface SearchProps {
    location: Location
}

/** Página de Busca. */
function SearchPage({ location }: SearchProps) {
    const { q: query } = extractSearchParam(location)

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

namespace SearchPage {
    // Reexporta para o `Router`
    export const PATH = PAGE_PATH
}
export default SearchPage
