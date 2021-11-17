/* eslint-disable @typescript-eslint/dot-notation */
import React, { Dispatch, ReactNode, createContext, useContext } from 'react'
import {
    ThemeProvider as MuiThemeProvider,
    ThemeOptions,
    createTheme,
    lighten,
    responsiveFontSizes,
} from '@mui/material/styles'
import { indigo, pink } from '@mui/material/colors'
import { deepmerge } from '@mui/utils'
import { useLocalStorage } from '@rehooks/local-storage'

/**
 * Configurações base os temas usados.
 *
 * @see https://bareynol.github.io/mui-theme-creator/
 * @see https://material.io/design/color/the-color-system.html Nomes para as cores.
 */
const baseTheme: ThemeOptions = {
    palette: {
        primary: {
            main: indigo['500'],
        },
        secondary: {
            main: pink['A400'],
        },
    },
    components: {
        MuiAutocomplete: {
            styleOverrides: {
                inputRoot: {
                    flexWrap: 'nowrap',
                },
            },
        },
        MuiUseMediaQuery: {
            defaultProps: {
                noSsr: true,
            },
        },
    },
}

/** Constrói tema a partir do tema base. */
function buildTheme(options: ThemeOptions) {
    const merged = deepmerge(baseTheme, options)
    return responsiveFontSizes(createTheme(merged))
}

/** Opções de tema. */
const THEMES = {
    light: buildTheme({
        palette: {
            mode: 'light',
            background: {
                default: lighten(indigo['500'], 0.9),
            },
        },
    }),
    dark: buildTheme({
        palette: {
            mode: 'dark',
        },
    }),
} as const

/** Modos de tema, claro ou escuro. */
export type ThemeMode = keyof typeof THEMES

/** Contexto para o modo do tema. */
const ThemeModeContext = createContext<[ThemeMode, Dispatch<ThemeMode>]>(
    ['light', () => {}],
)

interface ThemeModeProviderProps {
    /** Modo padrão do sistema. */
    defaultMode: ThemeMode
    /** Chave para armazenamento no browser (com {@link window.localStorage}). */
    storageKey: string
    /** Demais componentes. */
    children?: ReactNode
}

/** Provedor de modo de tema, usando estado guardado no browser. */
export default function ThemeProvider(
    { defaultMode, children, storageKey }: ThemeModeProviderProps,
) {
    const [themeMode, setThemeMode] = useLocalStorage(storageKey, defaultMode)

    return (
        <ThemeModeContext.Provider value={[themeMode, setThemeMode]}>
            <MuiThemeProvider theme={THEMES[themeMode]}>
                { children }
            </MuiThemeProvider>
        </ThemeModeContext.Provider>
    )
}

/** Estado global do mode do tema. */
export function useThemeMode() {
    return useContext(ThemeModeContext)
}
