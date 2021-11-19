import React, { ReactNode } from 'react'
import { useMatch } from 'react-router-dom'
import { Stack } from '@mui/material'
import { css } from '@emotion/css'

import RouterButton from 'components/RouterButton'

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
        </Nav>
    )
}

/** {@link Stack} horizontal com `component="nav"`. */
function Nav({ children }: { children?: ReactNode }) {
    return (
        <Stack
            component="nav"
            direction="row"
            spacing={2}
        >
            { children }
        </Stack>
    )
}

/** Classe CSS com largura fixada. */
const fixedWidth = css`
    width: 12ch;
`

interface NavLinkProps {
    to: string
    children?: ReactNode
    startIcon?: ReactNode
    endIcon?: ReactNode
}

/**
 * Um único link de navegação.
 */
function NavLink({ to: path, ...props }: NavLinkProps) {
    const match = useMatch({ path, caseSensitive: true, end: true })

    return (
        <RouterButton
            to={path}
            color="inherit"
            size="large"
            variant={match ? 'outlined' : 'text'}
            aria-current="page"
            className={fixedWidth}
            {...props}
        />
    )
}
