import React, { HTMLAttributes, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { AutocompleteRenderOptionState } from '@mui/material'
import { css } from '@emotion/css'

import { MatchedContent } from './matches'
import MatchAutocomplete, { InputParams } from './MatchAutocomplete'
import SearchInput from './SearchInput'
import MatchItem from './MatchItem'

const _TODO = css`max-width: 60ch;`

/** Opção do {@link MatchAutocomplete} para adicionar margem para o botão de clear.  */
const componentsProps = {
    clearIndicator: {
        className: css`
            right: 4px;
        `,
    },
}

/**
 * Barra de Busca Principal: lista resultados de busca e redireciona resultado escolhido para a
 *  página do conteúdo associado.
 */
export default function SearchBar() {
    const history = useHistory()
    // redireciona quando escolhido
    const redirectToChoice = useCallback(
        (_, match: MatchedContent | string | null | undefined) => {
            if (typeof match === 'object' && match?.asUrl) {
                history.push(match.asUrl)
            }
        },
        [history],
    )

    return (
        <MatchAutocomplete
            fullWidth
            className={_TODO}
            onChange={redirectToChoice}
            renderInput={renderInput}
            renderOption={renderOption}
            componentsProps={componentsProps}
            autoComplete
            filterSelectedOptions
            includeInputInList
        />
    )
}

/**
 * Opção de resultado da busca.
 *
 * @see {@link MatchItem}
 */
function renderOption(
    props: HTMLAttributes<HTMLLIElement>,
    option: MatchedContent,
    state: AutocompleteRenderOptionState,
) {
    return <MatchItem {...props} option={option} {...state} />
}

/**
 * Caixa de texto para entrada do usuário.
 *
 * @see {@link SearchInput}
 */
function renderInput(props: InputParams) {
    return <SearchInput {...props} />
}
