import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { Box, Button, useTheme } from '@mui/material'

import ThemeSwitch from './ThemeSwitch'

/**
 * Links de Navegação.
 */
export default function NavBar() {
    const theme = useTheme()
    const boxMargin = theme.spacing('auto', 2)
    const buttonMargin = theme.spacing('auto', 1)

    return (
        <Box sx={{ margin: boxMargin }} component="nav">
            <NavLink to="/arvore" margin={buttonMargin}>
                Árvore
            </NavLink>
            <NavLink to="/grade" margin={buttonMargin}>
                Grade
            </NavLink>
            <ThemeSwitch />
        </Box>
    )
}

interface NavLinkProps {
    children: string
    to: string
    margin: string
}

/**
 * Um único link de navegação.
 */
function NavLink({ children, to, margin }: NavLinkProps) {
    const match = useRouteMatch(to)
    const current = (match?.path === to)

    return (
        <Button
            component={Link}
            to={to}
            color="inherit"
            size="large"
            variant={current ? 'outlined' : 'text'}
            sx={{ width: '12ch', margin }}
            aria-current="page"
        >
            { children }
        </Button>
    )
}
