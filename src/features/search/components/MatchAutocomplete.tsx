import React, { ReactNode, useCallback, useState } from 'react'
import {
    Autocomplete,
    AutocompleteInputChangeReason,
    AutocompleteProps,
    AutocompleteRenderInputParams,
} from '@mui/material'

import type { MatchedContent } from '../types/content'
import { useMatches } from '../hooks/useMatches'

/** Instância de {@link Autocomplete} com `T = MatchedContent`. */
type MatchAutocompleteBaseProps = AutocompleteProps<MatchedContent, false, false, true>

/** Propriedades sobrescritas em {@link MatchAutocomplete}. */
type OverridedProps =
    'freeSolo' | 'filterOptions' | 'options' | 'isOptionEqualToValue' |
    'value' | 'defaultValue' | 'inputValue' | 'onInputChange' | 'getOptionDisabled' |
    'getOptionLabel' | 'renderInput' | 'renderGroup' | 'loading'

export interface InputParams extends AutocompleteRenderInputParams {
    loading: boolean
}

interface MatchAutocompleteProps extends Omit<MatchAutocompleteBaseProps, OverridedProps> {
    /** Erros encotrados durante a busca. */
    onError?: (error: any) => void
    /** {@link AutocompleteProps.renderInput} com estado de loading. */
    renderInput: (params: InputParams) => ReactNode,
}

/**
 * {@link Autocomplete} especializado para {@link Match}, com opções
 * e sistema de busca controlado por {@link useMatches}.
 */
export default function MatchAutocomplete(props: MatchAutocompleteProps) {
    const { onError, renderInput, ...params } = props

    // estado de loading dos resultados da busca
    const [loading, setLoading] = useState(false)
    // sistema de busca e controle das opções
    const [matches, search] = useMatches({ setLoading, onError })
    // entrada textual do usuário
    const [input, setInput] = useState(matches.query)

    /** Realiza a busca quando o usuário altera a caixa de texto. */
    const searchInput = useCallback(
        (_, inputValue: string, reason: AutocompleteInputChangeReason) => {
            setInput(inputValue)
            if (reason === 'input') {
                search(inputValue)
            }
        },
        [setInput, search],
    )
    /** Renderiza input textual usando variável de loading. */
    const renderWithLoading = useCallback(
        (inputParams: AutocompleteRenderInputParams) => {
            return renderInput({ ...inputParams, loading })
        },
        [renderInput, loading],
    )

    return (
        <Autocomplete
            {...params}
            freeSolo
            handleHomeEndKeys={params.handleHomeEndKeys ?? true}
            filterOptions={noFilter}
            options={matches.results}
            isOptionEqualToValue={matchedEquals}
            inputValue={input}
            renderInput={renderWithLoading}
            onInputChange={searchInput}
            getOptionDisabled={isDisabled}
            getOptionLabel={getDescription}
        />
    )
}

/**
 * Filtro de opções que não faz nada. Importante para opções que mudam de forma assíncrona.
 *
 * @see https://mui.com/components/autocomplete/#search-as-you-type
 */
function noFilter<T>(options: T[]) {
    return options
}

/** Se o resultado da busca não tem link. */
function isDisabled(option: MatchedContent) {
    return option.url === undefined
}

/** Se dois resultado são iguais. */
function matchedEquals(a: MatchedContent, b: MatchedContent) {
    return a.identifier === b.identifier
}

/** Descrição única do resultado. */
function getDescription(match: MatchedContent) {
    return match.description
}
