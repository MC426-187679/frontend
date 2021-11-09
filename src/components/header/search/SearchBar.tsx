/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLAttributes, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { InputBase } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

import { Match } from 'models/match'
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
            onChange={redirectToChoice}
            renderInput={renderInput}
            renderOption={renderOption}
            autoComplete
            filterSelectedOptions
            includeInputInList
            disablePortal
            open
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
    const { id, disabled, inputProps, InputProps } = props

    return (
        <InputBase
            id={id}
            disabled={disabled}
            fullWidth
            inputProps={inputProps}
            ref={InputProps.ref}
            // size={size ?? 'medium'}
            // className={InputProps.className}
            startAdornment={(
                <SearchIcon
                    sx={{
                        height: '100%',
                        margin: '0 10px',
                    }}
                />
            )}
            endAdornment={InputProps.endAdornment}
            placeholder="Pesquisar..."
        />
    )
}
