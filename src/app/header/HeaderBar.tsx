import React from 'react'
import { AppBar, Box, Toolbar, Typography } from '@mui/material'

import AccountMenu from './AccountMenu'
import NavBar from './NavBar'
import SearchBar from './SearchBar'

export default function HeaderBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        Planejador
                    </Typography>
                    <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
                        <SearchBar />
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {/* TODO: change display on 'xs' */}
                        <NavBar />
                    </Box>
                    <AccountMenu />
                </Toolbar>
            </AppBar>
        </Box>
    )
}
