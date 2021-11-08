import React, { Dispatch, ReactNode, createContext, useContext } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { useLocalStorage } from '@rehooks/local-storage'

import { THEMES } from 'utils/theme'

/** Modos de tema, claro ou escuro. */
export type ThemeMode = keyof typeof THEMES

/** Contexto para o modo do tema. */
export const ThemeModeContext = createContext<[ThemeMode, Dispatch<ThemeMode>]>(
    ['light', () => {}],
)

interface ThemeModeProviderProps {
    defaultMode: ThemeMode
    children: ReactNode
}

/** Chave para guardar o modo do tema no browser. */
const THEME_MODE_KEY = 'theme-mode'

/** Provedor de modo de tema, usando estado guardado no browser. */
export default function ThemeModeProvider({ defaultMode, children }: ThemeModeProviderProps) {
    const [themeMode, setThemeMode] = useLocalStorage(THEME_MODE_KEY, defaultMode)

    return (
        <ThemeModeContext.Provider value={[themeMode, setThemeMode]}>
            <ThemeProvider theme={THEMES[themeMode]}>
                { children }
            </ThemeProvider>
        </ThemeModeContext.Provider>
    )
}

/** Estado global do mode do tema. */
export function useThemeMode() {
    return useContext(ThemeModeContext)
}
