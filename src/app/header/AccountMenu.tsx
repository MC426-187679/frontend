import React, { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Button, Menu, MenuItem } from '@mui/material'
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
    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget)
    }
    // close by dettaching
    const closeMenu = useCallback(
        () => setAnchor(null),
        [setAnchor],
    )

    const menuId = 'primary-account-menu'
    return (
        <>
            <Button
                startIcon={<AccountCircle />}
                size="large"
                aria-label="conta do usuário atual"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={openMenu}
                color="inherit"
            >
                {/* TODO: hide on small screens */}
                [Usuário]
            </Button>
            <Menu
                anchorEl={anchor}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id={menuId}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={closeMenu}
            >
                <Item path="/perfil" onClick={closeMenu}>Perfil</Item>
                <Item path="/config" onClick={closeMenu}>Configurações</Item>
            </Menu>
        </>
    )
}

interface ItemProps {
    children: string
    path: string
    onClick?: () => void
}

/**
 * {@link MenuItem} mixed in with {@link Link}
 */
function Item({ children, path, onClick }: ItemProps) {
    return (
        <MenuItem onClick={onClick} component={Link} to={path}>
            { children }
        </MenuItem>
    )
}
