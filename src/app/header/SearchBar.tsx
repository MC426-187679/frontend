import React, { FormEvent, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { IconButton, InputBase } from '@mui/material'
import { alpha, styled, useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'

import './SearchBar.scss'
import { QUERY_PATH, QUERY_PARAM, useSearchQuery } from '../search/searchParams'

// from https://next.material-ui.com/components/app-bar
const Search = styled('form')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(1),
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
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '40ch',
            '&:focus, .search-icon-button:focus + &': {
                width: '70ch',
            },
        },
    },
}))

/**
 * Main Search Bar: dispatch queries to the
 *  main search page and have autocomplete (TODO).
 */
export default function SearchBar() {
    // URL and query string path
    const history = useHistory()
    const currentQuery = useSearchQuery()

    // change route but don't actually redirect
    const redirectToSearch = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            const value = event.currentTarget[QUERY_PARAM]?.value

            if (typeof value === 'string' && value !== '') {
                history.push(`${QUERY_PATH}?${QUERY_PARAM}=${value}`)
            } else {
                history.push(QUERY_PATH)
            }
            event.preventDefault()
        },
        [history],
    )

    return (
        <Search
            action={QUERY_PATH}
            onSubmit={redirectToSearch}
            autoComplete="off"
            noValidate
        >
            <SearchButton />
            <StyledInputBase
                placeholder="Pesquisar..."
                inputProps={{
                    'aria-label': 'pesquisar',
                    name: QUERY_PARAM,
                    defaultValue: currentQuery,
                }}
            />
        </Search>
    )
}

/**
 * {@link IconButton} with {@link SearchIcon}.
 */
function SearchButton() {
    // theme dependent padding
    const theme = useTheme()
    const padding = theme.spacing(0, 1.5)

    return (
        <IconButton
            disableRipple
            type="submit"
            className="search-icon-button"
            sx={{ padding }}
        >
            {/* TODO: remove ripple */}
            <SearchIcon />
        </IconButton>
    )
}
