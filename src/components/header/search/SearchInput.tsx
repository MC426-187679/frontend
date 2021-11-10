/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { CircularProgress, Fade, InputBase, styled } from '@mui/material'
import { Search } from '@mui/icons-material'

import { InputParams } from './MatchAutocomplete'

/** Caixa de texto com cor do background. */
const Input = styled(InputBase)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius,
}))

/** Ícone de busca, com margem lateral. */
const SearchIcon = styled(Search)(({ theme }) => ({
    height: '100%',
    margin: theme.spacing(0, 1),
}))

/** Ícone circular com efeito de loading. */
const PaddedProgress = styled(CircularProgress)(({ theme }) => ({
    height: '100%',
    padding: theme.spacing(1),
}))

/** Fade-in de 500ms e fade-out de 0ms. */
const loadingDuration = {
    enter: 500,
    exit: 0,
} as const

/** Loading circular com efeito de fade-in. */
function Loading({ isLoading }: { isLoading: boolean }) {
    return (
        <Fade in={isLoading} timeout={loadingDuration} unmountOnExit>
            <PaddedProgress />
        </Fade>
    )
}

/** Caixa de texto para entrada do usuário. */
export default function SearchInput(props: InputParams) {
    const { InputProps, InputLabelProps, loading, ...params } = props
    const { startAdornment, endAdornment, ...inputParams } = InputProps

    return (
        <Input
            placeholder="Pesquisar..."
            {...params}
            {...inputParams}
            startAdornment={(
                <>
                    <SearchIcon />
                    {startAdornment}
                </>
            )}
            endAdornment={(
                <>
                    <Loading isLoading={loading} />
                    {endAdornment}
                </>
            )}
        />
    )
}
