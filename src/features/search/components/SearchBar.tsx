import React, { HTMLAttributes, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { AutocompleteRenderOptionState } from '@mui/material'
import { css } from '@emotion/css'

import type { MatchedContent } from '../types/content'
import MatchAutocomplete, { InputParams } from './MatchAutocomplete'
import SearchInput from './SearchInput'
import MatchItem from './MatchItem'

/** Classe CSS com largura máxima fixada. */
const hasMaxWidth = css`
    max-width: 60ch;
`

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
            if (typeof match === 'object' && match?.url) {
                history.push(match.url)
            }
        },
        [history],
    )

    return (
        <MatchAutocomplete
            fullWidth
            className={hasMaxWidth}
            onChange={redirectToChoice}
            renderInput={renderInput}
            renderOption={renderOption}
            componentsProps={componentsProps}
            autoComplete
            filterSelectedOptions
            includeInputInList
            clearText="Limpar"
            openText="Abrir"
            closeText="Fechar"
            loadingText="Carregando..."
            noOptionsText="Sem resultados"
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
