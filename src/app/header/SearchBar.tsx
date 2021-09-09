import React, { FormEvent, useRef } from 'react'
import { useHistory } from 'react-router-dom'
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
    // theme dependent padding
    const theme = useTheme()
    const padding = theme.spacing(0, 1.5)
    // shared values
    const inputRef = useRef<HTMLInputElement>(null)
    const queryPath = '/busca'
    const queryId = 'q'

    // push URL but don't redirect
    const history = useHistory()

    const redirectToSearch = (event: FormEvent<HTMLFormElement>) => {
        const value = inputRef.current?.value
        // check if value is non-empty strings
        if (value) {
            history.push(`${queryPath}?${queryId}=${value}`)
        } else {
            history.push(queryPath)
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
            <IconButton
                disableRipple
                type="submit"
                className="search-icon-button"
                sx={{ padding }}
            >
                {/* TODO: remove ripple */}
                <SearchIcon />
            </IconButton>
            <StyledInputBase
                placeholder="Pesquisar..."
                inputProps={{
                    'aria-label': 'pesquisar',
                    name: queryId,
                    ref: inputRef,
                }}
            />
        </Search>
    )
}
