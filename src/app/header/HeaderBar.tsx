import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

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
                    <SearchBar />
                    <Box sx={{ flexGrow: 1 }} />
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
