import React, { type AriaRole, type ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Link, Stack, Toolbar, Typography, useMediaQuery } from '@mui/material'
import type { Breakpoint, Theme } from '@mui/material/styles'
import { css } from '@emotion/css'

import { SearchBar } from 'features/search'

import AccountMenu from './AccountMenu'
import NavBar from './NavBar'
import ThemeSwitch from './ThemeSwitch'

/** Classes CSS com configuração de posição dos elmentos da flexbox. */
const toolbarClass = css`
    align-content: stretch;
    justify-content: space-between;
`

/**
 * Barra de Cabeçalho em 3 partes:
 *  - logotipo
 *  - barra de busca
 *  - links de navegação
 *  - seletor de tema
 */
export default React.memo(
    function HeaderBar() {
        const isOkay = useBreakpoint('sm')
        const isMedium = useBreakpoint('md')
        const isLarge = useBreakpoint('lg')

        return (
            <AppBar position="static" role="banner">
                <Toolbar className={toolbarClass} role="toolbar">

                    {/* Logotipo */}
                    <AlignedRow alignment="left">
                        {isMedium && <BrandLink />}
                    </AlignedRow>

                    {/* Busca */}
                    <SearchBar />

                    {/* Navegação */}
                    <AlignedRow alignment="right">
                        {isLarge && <NavBar />}
                        {isOkay && <ThemeSwitch />}
                        <AccountMenu isLarge={isOkay} />
                    </AlignedRow>

                </Toolbar>
            </AppBar>
        )
    },
    // sempre igual
    () => true,
)

/**
 * Logotipo em texto com um link para a página principal.
 */
const BrandLink = React.memo(
    function BrandLink() {
        return (
            <Link underline="none" color="inherit" component={RouterLink} to="/">
                <Typography variant="h6" noWrap component="div" marginX={1}>
                    Planejador
                </Typography>
            </Link>
        )
    },
    // sempre igual
    () => true,
)

/** {@link useMediaQuery} específico para {@link Breakpoint}s. */
function useBreakpoint(key: Breakpoint, limit: 'up' | 'down' | 'only' = 'up') {
    return useMediaQuery((theme: Theme) => {
        return theme.breakpoints[limit](key)
    })
}
/** Classe CSS com configurações do container flex de {@link AlignedRow}. */
const alignedRowClass = css`
    flex-basis: 0;
    flex-grow: 1;
`

type AlignedRowProps = {
    children?: ReactNode
    alignment: 'left' | 'right'
    role?: AriaRole
}

/** {@link Stack} com `direction="row"` e alinhamento da flexbox. */
function AlignedRow({ children, alignment, role }: AlignedRowProps) {
    if (!children) {
        return null
    }

    return (
        <Stack
            role={role}
            direction="row"
            spacing={2}
            className={alignedRowClass}
            justifyContent={alignment}
            marginRight={(alignment === 'left') ? 1 : 0}
            marginLeft={(alignment === 'right') ? 1 : 0}
        >
            { children }
        </Stack>
    )
}
