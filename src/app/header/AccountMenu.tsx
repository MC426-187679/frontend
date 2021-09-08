import React, { MouseEvent, ReactNode, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import AccountCircle from '@mui/icons-material/AccountCircle'

/**
 * Account Options and Links: change
 *  according to currently logged user
 */
export default function AccountMenu() {
    // NOTE: to avoid redrawing things, the open menu is
    // always loaded on the background, but only shows up
    // when anchored to a foreground element
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    const isMenuOpen = (anchor !== null)

    // open it up by attaching to element that triggered event
    const openMenu = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            setAnchor(event.currentTarget)
        },
        [setAnchor],
    )
    // close by dettaching
    const closeMenu = useCallback(
        () => setAnchor(null),
        [setAnchor],
    )

    const menuId = 'primary-account-menu'
    return (
        <>
            <ButtonWithHideableText
                icon={<AccountCircle />}
                id={menuId}
                onClick={openMenu}
            >
                [Usuário]
            </ButtonWithHideableText>
            <Menu
                anchorEl={anchor}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id={menuId}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={closeMenu}
            >
                <LinkItem to="/perfil" onClick={closeMenu}>Perfil</LinkItem>
                <LinkItem to="/config" onClick={closeMenu}>Configurações</LinkItem>
            </Menu>
        </>
    )
}

interface ItemProps {
    children: string
    to: string
    onClick?: () => void
}

/**
 * {@link MenuItem} mixed in with {@link Link}
 */
function LinkItem({ children, to, onClick }: ItemProps) {
    return (
        <MenuItem component={Link} to={to} onClick={onClick}>
            { children }
        </MenuItem>
    )
}

interface ButtonWHTProps {
    children: string
    id: string
    icon: ReactNode
    onClick: (event: MouseEvent<HTMLElement>) => void
}

/**
 *  Button that turns into {@link Button} with an
 * icon for large screens and just an {@link
 * IconButton} for small ones.
 */
function ButtonWithHideableText({ children, id, icon, onClick }: ButtonWHTProps) {
    const isLarge = useMediaQuery((theme: Theme) => (
        theme.breakpoints.up('sm')
    ))

    // computer / large screen
    if (isLarge) {
        return (
            <Button
                startIcon={icon}
                size="large"
                aria-label="conta do usuário atual"
                aria-controls={id}
                aria-haspopup="true"
                onClick={onClick}
                color="inherit"
            >
                { children }
            </Button>
        )
    // phone / small screen
    } else {
        return (
            <IconButton
                size="large"
                aria-label="conta do usuário atual"
                aria-controls={id}
                aria-haspopup="true"
                onClick={onClick}
                color="inherit"
            >
                { icon }
            </IconButton>
        )
    }
}
