import React, { HTMLAttributes, useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import './SearchBar.scss'
import { Match } from 'models/match'
import SearchInput from './SearchInput'
import MatchAutocomplete, { InputParams } from './MatchAutocomplete'

/**
 * Barra de Busca Principal: lista resultados de busca e redireciona resultado escolhido para a
 *  página do conteúdo associado.
 */
export default function SearchBar() {
    const history = useHistory()
    // redireciona quando escolhido
    const redirectToChoice = useCallback(
        (_, match: Match | string | null | undefined) => {
            if (match instanceof Match) {
                const path = match.asUrl()
                if (path) {
                    history.push(path)
                }
            }
        },
        [history],
    )

    return (
        <MatchAutocomplete
            fullWidth
            className="search-bar-input"
            onChange={redirectToChoice}
            renderInput={renderInput}
            renderOption={renderOption}
            autoComplete
            filterSelectedOptions
            includeInputInList
            disablePortal
        />
    )
}

/** Opção de resultado da busca, renderizado como `<li>`. */
function renderOption(props: HTMLAttributes<HTMLLIElement>, option: Match) {
    return (
        <li {...props} key={option.uniqueMatchIdentifier()}>
            { option.uniqueMatchDescription() }
        </li>
    )
}

/** Caixa de texto para entrada do usuário. */
function renderInput(props: InputParams) {
    return <SearchInput {...props} />
}
