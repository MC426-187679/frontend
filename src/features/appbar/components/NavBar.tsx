import React, { ReactNode } from 'react'
import { useMatch } from 'react-router-dom'
import { Stack } from '@mui/material'
import { css } from '@emotion/css'

import RouterButton from 'components/RouterButton'

/**
 * Links de Navegação.
 */
export default React.memo(
    function NavBar() {
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
    },
    // sempre igual
    () => true,
)

/** {@link Stack} horizontal com `component="nav"`. */
function Nav({ children }: { children?: ReactNode }) {
    return (
        <Stack
            role="navigation"
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
    /** href do link. */
    to: string
    /** Texto do link. */
    children: string
}

/**
 * Um único link de navegação.
 */
const NavLink = React.memo(
    function NavLink({ to: path, children }: NavLinkProps) {
        const match = useMatch({ path, caseSensitive: true, end: true })

        return (
            <RouterButton
                to={path}
                color="inherit"
                size="large"
                variant={match ? 'outlined' : 'text'}
                aria-current={match ? 'page' : undefined}
                className={fixedWidth}
            >
                { children }
            </RouterButton>
        )
    },
    // memoização padrão do React
)
