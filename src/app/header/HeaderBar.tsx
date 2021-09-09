import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { AppBar, Box, Link, Toolbar, Typography, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'

import './HeaderBar.scss'
import AccountMenu from './AccountMenu'
import NavBar from './NavBar'
import SearchBar from './SearchBar'

/**
 * Header Bar above page content: split
 *  in 3: brand name, search bar and
 *  navigation links
 */
export default function HeaderBar() {
    const isLarge = useMediaQuery((theme: Theme) => (
        theme.breakpoints.up('sm')
    ))

    return (
        <div className="app-bar-box">
            <AppBar position="static">
                <Toolbar>

                    {/* Brand */}
                    {isLarge && (
                        <Box className="header-box-left">
                            <BrandLink />
                        </Box>
                    )}

                    {/* Search */}
                    <Box className="header-box-center">
                        <SearchBar />
                    </Box>

                    {/* Navigation */}
                    <Box className={isLarge ? 'header-box-right' : ''}>
                        {isLarge && (
                            <NavBar />
                        )}
                        <AccountMenu />
                    </Box>

                </Toolbar>
            </AppBar>
        </div>
    )
}

/** Brand name with link to home page. */
function BrandLink() {
    return (
        <Link underline="none" color="inherit" component={RouterLink} to="/">
            <Typography variant="h6" noWrap component="div">
                Planejador
            </Typography>
        </Link>
    )
}
