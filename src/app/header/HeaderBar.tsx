import React from 'react'
import { AppBar, Box, Toolbar, Typography, Theme, useMediaQuery } from '@mui/material'

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
                            <Typography variant="h6" noWrap component="div">
                                Planejador
                            </Typography>
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
