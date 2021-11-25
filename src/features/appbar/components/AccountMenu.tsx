import React, { type MouseEvent, type ReactNode, useCallback, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, IconButton, Menu, MenuItem } from '@mui/material'
import { AccountCircle } from '@mui/icons-material'

interface AccountMenuProps {
    isLarge?: boolean
}

/**
 * Links e Opções da Conta: muda de acordo com o usuário logado (TODO)
 */
export default function AccountMenu({ isLarge }: AccountMenuProps) {
    // NOTA: para evitar redesenhar as coisas, o menu sempre fica aberto em background,
    // mas só aparece quando ancorado no botão que abre o menu (foreground)
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    const isMenuOpen = (anchor !== null)

    // anexa o menu to elemento que ativou ele, abrindo ele na tela
    const openMenu = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            setAnchor(event.currentTarget)
        },
        [setAnchor],
    )
    // fecha o menu (desanexa ele)
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
                isLarge={isLarge}
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
 * {@link MenuItem} misturado com {@link Link}
 */
function LinkItem({ children, to, onClick }: ItemProps) {
    return (
        <MenuItem component={RouterLink} to={to} onClick={onClick}>
            { children }
        </MenuItem>
    )
}

interface ButtonWHTProps {
    children: string
    id: string
    icon: ReactNode
    onClick: (event: MouseEvent<HTMLElement>) => void
    isLarge?: boolean
}

/**
 *  Botão que vira um {@link Button} com um ícone para telas grandes, e só um {@link IconButton}
 * em telas pequenas.
 */
function ButtonWithHideableText({ children, id, icon, onClick, isLarge }: ButtonWHTProps) {
    // desktop / tela grande
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
    // fone / tela pequena
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
