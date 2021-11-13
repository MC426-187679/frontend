import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Box, Link, Toolbar, Typography, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'

import { SearchBar } from 'features/search'

import './HeaderBar.scss'
import AccountMenu from './AccountMenu'
import NavBar from './NavBar'
import ThemeSwitch from './ThemeSwitch'

/**
 * Barra de Cabeçalho em 3 partes:
 *  - logotipo
 *  - barra de busca
 *  - links de navegação
 *  - seletor de tema
 */
export default function HeaderBar() {
    const isLarge = useMediaQuery((theme: Theme) => (
        theme.breakpoints.up('sm')
    ))

    return (
        <div className="app-bar-box">
            <AppBar position="static">
                <Toolbar>

                    {/* Logotipo */}
                    {isLarge && (
                        <Box className="header-box-left">
                            <BrandLink />
                        </Box>
                    )}

                    {/* Busca */}
                    <SearchBar />

                    {/* Navegação */}
                    <Box className={isLarge ? 'header-box-right' : ''}>
                        {isLarge && <NavBar />}
                        {isLarge && <ThemeSwitch />}
                        <AccountMenu />
                    </Box>

                </Toolbar>
            </AppBar>
        </div>
    )
}

/**
 * Logotipo em texto com um link para a página principal.
 */
function BrandLink() {
    return (
        <Link underline="none" color="inherit" component={RouterLink} to="/">
            <Typography variant="h6" noWrap component="div">
                Planejador
            </Typography>
        </Link>
    )
}
