import React, { FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import type { Location } from 'history'
import { IconButton, InputBase } from '@mui/material'
import { alpha, styled, useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'

import './SearchBar.scss'

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
    const queryPath = '/busca'
    const queryId = 'q'
    const [currentQuery, setQuery] = useURLQuery(queryPath, queryId)

    // change route but don't actually redirect
    const redirectToSearch = (event: FormEvent<HTMLFormElement>) => {
        const value = event.currentTarget[queryId]?.value

        if (typeof value === 'string') {
            setQuery(value)
        } else {
            setQuery()
        }
        event.preventDefault()
    }

    return (
        <Search
            action={queryPath}
            onSubmit={redirectToSearch}
            autoComplete="off"
            noValidate
        >
            <SearchButton />
            <StyledInputBase
                placeholder="Pesquisar..."
                inputProps={{
                    'aria-label': 'pesquisar',
                    name: queryId,
                    defaultValue: currentQuery,
                }}
            />
        </Search>
    )
}

/**
 * Extract URL query from {@link Location} object
 *
 *  If current URL is '/path?id=something' then
 * this function returns 'something'.
 */
function extractQueryParams(path: string, id: string, { pathname, search }: Location) {
    if (pathname !== path) {
        return undefined
    }
    const params = new URLSearchParams(search)
    return params.get(id) ?? undefined
}

/**
 *  Hook for extracting current query string on 'path'
 * and changing as needed.
 */
function useURLQuery(path: string, id: string) {
    const history = useHistory()
    const current = extractQueryParams(path, id, history.location)

    function setQuery(value?: string) {
        if (value) {
            history.push(`${path}?${id}=${value}`)
        } else {
            history.push(path)
        }
    }
    return [current, setQuery] as const
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
