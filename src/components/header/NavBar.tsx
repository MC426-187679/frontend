import React, { ReactNode } from 'react'
import { Link as RouterLink, useRouteMatch } from 'react-router-dom'
import { Button, styled } from '@mui/material'

import ThemeSwitch from './ThemeSwitch'

/** Elevemnto de navegação com margens laterais. */
const Nav = styled('nav')(({ theme }) => ({
    margin: theme.spacing('auto', 2),
}))

/**
 * Links de Navegação.
 */
export default function NavBar() {
    return (
        <Nav>
            <NavLink to="/arvore">
                Árvore
            </NavLink>
            <NavLink to="/grade">
                Grade
            </NavLink>
            <ThemeSwitch />
        </Nav>
    )
}

interface NavLinkProps {
    to: string
    children?: ReactNode
    startIcon?: ReactNode
    endIcon?: ReactNode
}

/** Instanciação de {@link Button} com `component` {@link RouterLink}. */
type ButtonWithLink =
    (props: NavLinkProps & {
        component: typeof RouterLink
        color: 'inherit'
        size: 'large'
        variant: 'outlined' | 'text'
        'aria-current': 'page'
    }) => JSX.Element

/** Botão de navegação, com largura fixada e margem lateral. */
const NavButton = styled(Button as ButtonWithLink)(({ theme }) => ({
    width: '12ch',
    margin: theme.spacing('auto', 1),
}))

/**
 * Um único link de navegação.
 */
function NavLink({ children, to, startIcon, endIcon }: NavLinkProps) {
    const match = useRouteMatch(to)

    return (
        <NavButton
            component={RouterLink}
            to={to}
            color="inherit"
            size="large"
            variant={match ? 'outlined' : 'text'}
            aria-current="page"
            startIcon={startIcon}
            endIcon={endIcon}
        >
            { children }
        </NavButton>
    )
}
