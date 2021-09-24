import React, { FormEvent } from 'react'
import { useHistory } from 'react-router-dom'
import { IconButton, InputBase } from '@mui/material'
import { alpha, styled, useTheme } from '@mui/material/styles'
import SearchIcon from '@mui/icons-material/Search'

import './SearchBar.scss'
import { PATH, extractSearchParam, searchURL } from 'pages/Search/params'

// fonte: https://next.material-ui.com/components/app-bar
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

// fonte: https://next.material-ui.com/components/app-bar
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

/** Nome do parâmetro na caixa de busca. */
const INPUT_NAME = 'texto'

/**
 * Barra de Busca Principal: redireciona buscas
 *  para a página de busca e tem um sistema de
 *  autocomplete (TODO).
 */
export default function SearchBar() {
    // caminho e texto de busca recuperados da URL
    const history = useHistory()
    const { q: currentQuery } = extractSearchParam(history.location)

    // muda a rota (URL) mas não redireciona de verdade
    const redirectToSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const value = event.currentTarget[INPUT_NAME]?.value
        if (typeof value === 'string') {
            history.push(searchURL({ q: value }))
        } else {
            history.push(PATH)
        }
    }

    return (
        <Search
            action={PATH}
            onSubmit={redirectToSearch}
            autoComplete="off"
            noValidate
        >
            <SearchButton />
            <StyledInputBase
                placeholder="Pesquisar..."
                inputProps={{
                    'aria-label': 'pesquisar',
                    name: INPUT_NAME,
                    defaultValue: currentQuery,
                }}
            />
        </Search>
    )
}

/**
 * {@link IconButton} com {@link SearchIcon}.
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
            {/* TODO: remover efeitos de ripple */}
            <SearchIcon />
        </IconButton>
    )
}
