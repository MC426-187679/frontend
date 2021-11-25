import React, { type Dispatch, type ReactNode, createContext, useContext, useMemo } from 'react'
import { useMediaQuery } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'

import { Themes } from 'config/themes'
import { useStorage } from 'hooks/useStorage'

/** Modos de tema, claro ou escuro. */
export type ThemeMode = keyof typeof Themes

/* eslint-disable-next-line @typescript-eslint/no-redeclare */
namespace ThemeMode {
    /** Checa se a string é um modo de tema válido. */
    export function isThemeMode(key: string): key is ThemeMode {
        return key in Themes
    }

    /**
     * Texto de busca da configuração do usuário usando media query.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme
     */
    export const userPrefersDarkModeQuery = '(prefers-color-scheme: dark)'

    /** Aplicação da busca de {@link userPrefersDarkModeQuery}. */
    function getUserPrefersDarkMode() {
        return window.matchMedia(userPrefersDarkModeQuery).matches
    }

    /**
     * Gera uma string válida de modo de tema a partir de um texto qualquer.
     *
     * @param text Texto base, que pode ser um modo de tema ou uma string qualquer.
     * @param userPrefersDark Usada para definir a preferência do usuário caso `text` não seja
     *  um tema válido. Se `null`, usa {@link getUserPrefersDarkMode} para decidir a preferência.
     *  Caso true, assume que o usuário prefere tema escuro. Se false, prefere tema claro.
     * @returns O tema definido pelo texto, se for válido, ou um tema com base na preferência
     *  do usuário.
     */
    export function fromString(text: string, userPrefersDark: boolean | null) {
        if (isThemeMode(text)) {
            return text
        } else {
            const prefersDark = userPrefersDark ?? getUserPrefersDarkMode()
            return prefersDark ? 'dark' : 'light'
        }
    }

    /** Tipo do {@link Context}. */
    type ContextType = readonly [theme: ThemeMode, setTheme: Dispatch<ThemeMode>]

    /** Contexto para o modo do tema. */
    export const Context = createContext<ContextType>([
        // padrão com base no usuário
        fromString('NO-DEFAULT', null),
        () => {},
    ])
}

/** Se `text` é um tema ou uma 'unset' (padrão para usar o tema do navegador). */
function isThemeKey(text: string): text is ThemeMode | 'unset' {
    return ThemeMode.isThemeMode(text) || text === 'unset'
}

interface ThemeProviderProps {
    /** Chave para armazenamento no browser (com {@link window.localStorage}). */
    storageKey: string
    /** Demais componentes. */
    children?: ReactNode
}

/** Provedor de modo de tema, usando estado guardado no browser. */
export default function ThemeProvider({ children, storageKey }: ThemeProviderProps) {
    const [themeKey, setThemeKey] = useStorage(storageKey, 'unset', isThemeKey)
    const userPrefersDark = useMediaQuery(ThemeMode.userPrefersDarkModeQuery)

    const theme = ThemeMode.fromString(themeKey, userPrefersDark)
    const ctx = useMemo(
        () => [theme, setThemeKey] as const,
        [theme, setThemeKey],
    )

    return (
        <ThemeMode.Context.Provider value={ctx}>
            <MuiThemeProvider theme={Themes[theme]}>
                { children }
            </MuiThemeProvider>
        </ThemeMode.Context.Provider>
    )
}

/** Estado global do mode do tema. */
export function useThemeMode() {
    return useContext(ThemeMode.Context)
}
