import React, { RefObject, useRef } from 'react'
import { CircularProgress, Fade, InputBase } from '@mui/material'
import { styled, emphasize } from '@mui/material/styles'
import { Search } from '@mui/icons-material'

import { InputParams } from './MatchAutocomplete'

/** Caixa de texto com cor de background. */
const Input = styled(InputBase)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.default,
    '&:hover': {
        backgroundColor: emphasize(theme.palette.background.default, 0.05),
    },
}))

/** Ícone de busca, com margem lateral. */
const SearchIcon = styled(Search)(({ theme }) => ({
    height: '100%',
    margin: theme.spacing(0, 1),
}))

/** Caixa de texto para entrada do usuário. */
export default function SearchInput(props: InputParams) {
    const { InputProps, InputLabelProps, loading, ...params } = props
    const { startAdornment, endAdornment, ...inputParams } = InputProps

    const inputRef = useRef<HTMLInputElement>(null)
    return (
        <Input
            placeholder="Pesquisar..."
            inputRef={inputRef}
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
                    <Loading isLoading={loading} inputRef={inputRef} />
                    {endAdornment}
                </>
            )}
        />
    )
}

/** Ícone circular com padding. */
const PaddedProgress = styled(CircularProgress)(({ theme }) => ({
    padding: theme.spacing(0.5),
}))

/** Fade-in de 500ms e fade-out de 0ms. */
const loadingDuration = {
    enter: 500,
    exit: 0,
} as const

interface LoadingProps {
    isLoading: boolean
    inputRef: RefObject<HTMLInputElement>
}

/** Loading circular com efeito de fade-in. */
function Loading({ isLoading, inputRef }: LoadingProps) {
    const size = inputRef.current?.clientHeight ?? 0
    return (
        <Fade in={isLoading} timeout={loadingDuration} unmountOnExit>
            <PaddedProgress size={size} />
        </Fade>
    )
}
