/* eslint-disable react/jsx-props-no-spreading */
import React, { HTMLAttributes, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { InputBase, styled } from '@mui/material'
import { Search } from '@mui/icons-material'

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

/** Ícone de busca, com margem lateral. */
const SearchIcon = styled(Search)(({ theme }) => ({
    height: '100%',
    margin: theme.spacing(0, 1),
}))

/** Caixa de texto para entrada do usuário. */
function renderInput(props: InputParams) {
    const { InputProps, InputLabelProps, loading, ...params } = props

    return (
        <InputBase
            {...params}
            {...InputProps}
            startAdornment={<SearchIcon />}
            placeholder="Pesquisar..."
        />
    )
}
