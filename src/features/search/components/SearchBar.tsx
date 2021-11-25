import React, { HTMLAttributes, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AutocompleteRenderOptionState, useTheme } from '@mui/material'
import { css } from '@emotion/css'

import { useErrors } from 'features/error-messages'

import type { MatchedContent } from '../types/content'
import MatchAutocomplete, { InputParams } from './MatchAutocomplete'
import SearchInput from './SearchInput'
import MatchItem from './MatchItem'

/** Classe CSS com largura máxima fixada. */
const autocompleteClass = css`
    max-width: 60ch;
    overflow: hidden;
`

/**
 * Barra de Busca Principal: lista resultados de busca e redireciona resultado escolhido para a
 *  página do conteúdo associado.
 */
export default function SearchBar() {
    // opção para adicionar margem no botão de clear
    const theme = useTheme()
    const componentsProps = useMemo(
        () => ({
            clearIndicator: {
                className: css`
                    right: ${theme.spacing(0.5)};
                `,
            },
        }),
        [theme],
    )

    // redireciona quando escolhido
    const navigate = useNavigate()
    const redirectToChoice = useCallback(
        (_, match: MatchedContent | string | null | undefined) => {
            if (typeof match === 'object' && match?.url) {
                navigate(match.url, { replace: false })
            }
        },
        [navigate],
    )
    // envia erro pro componente de mensagens de erro
    const dispatchError = useErrors()
    const sendError = useCallback(
        (error?: { message?: any }) => {
            const description = (typeof error?.message === 'string') ? `: ${error.message}` : ''

            dispatchError({
                kind: 'search-bar',
                message: `Problema de conexão com o servidor na realização da busca${description}.
                Por favor, cheque sua conexão com a internet ou tente novamente mais tarde.`,
                timeout: '15 s',
            })
        },
        [dispatchError],
    )

    return (
        <MatchAutocomplete
            fullWidth
            id="barra-de-busca"
            className={autocompleteClass}
            onChange={redirectToChoice}
            onError={sendError}
            renderInput={renderInput}
            renderOption={renderOption}
            componentsProps={componentsProps}
            autoComplete
            includeInputInList
            clearText="Limpar"
            openText="Abrir"
            closeText="Fechar"
            loadingText="Carregando..."
            noOptionsText="Sem resultados"
            role="searchbox"
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
