import React from 'react'
import { Box, InputBase } from '@mui/material'
import { alpha, styled, useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'

import './SearchBar.scss'

// from https://next.material-ui.com/components/app-bar
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}))

// from https://next.material-ui.com/components/app-bar
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '40ch',
            '&:focus': {
                width: '70ch',
            },
        },
    },
}))

/**
 * Main Search Bar: dispatch queries to the
 *  main search page (TODO) and have
 *  autocomplete (TODO).
 */
export default function SearchBar() {
    const theme = useTheme()
    const padding = theme.spacing(0, 2)

    return (
        <Search>
            <Box className="search-icon-button" sx={{ padding }}>
                {/* TODO: shoulde be clickable */}
                <SearchIcon />
            </Box>
            <StyledInputBase
                placeholder="Pesquisar..."
                inputProps={{ 'aria-label': 'pesquisar' }}
            />
        </Search>
    )
}
