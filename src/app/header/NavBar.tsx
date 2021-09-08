import React from 'react'
import { Link, useRouteMatch } from 'react-router-dom'
import { Box, Button, useTheme } from '@mui/material'

/**
 * Navigation Links
 */
export default function NavBar() {
    const theme = useTheme()
    const boxMargin = theme.spacing('auto', 2)
    const buttonMargin = theme.spacing('auto', 1)

    return (
        <Box sx={{ margin: boxMargin }}>
            <NavLink to="/arvore" margin={buttonMargin}>
                Árvore
            </NavLink>
            <NavLink to="/grade" margin={buttonMargin}>
                Grade
            </NavLink>
        </Box>
    )
}

interface NavLinkProps {
    children: string
    to: string
    margin: string
}

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
        >
            { children }
        </Button>
    )
}
