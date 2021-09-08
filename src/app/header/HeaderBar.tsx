import React from 'react'
import { AppBar, Box, Toolbar, Typography } from '@mui/material'

import './HeaderBar.scss'
import AccountMenu from './AccountMenu'
import NavBar from './NavBar'
import SearchBar from './SearchBar'

/**
 * Header Bar above page content: split in
 *  3 parts: brand name, search bar and
 *  navigation links
 */
export default function HeaderBar() {
    return (
        <div className="app-bar-box">
            <AppBar position="static">
                <Toolbar>
                    {/* Brand */}
                    <Box className="header-box-left">
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            Planejador
                        </Typography>
                    </Box>
                    {/* Search */}
                    <Box className="header-box-center">
                        <SearchBar />
                    </Box>
                    {/* Navigation */}
                    <Box className="header-box-right">
                        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                            {/* TODO: change display on 'xs' */}
                            <NavBar />
                        </Box>
                        <AccountMenu />
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    )
}
