/* eslint-disable @typescript-eslint/dot-notation, import/prefer-default-export */
import { ThemeOptions, createTheme, lighten, responsiveFontSizes } from '@mui/material/styles'
import { indigo, pink } from '@mui/material/colors'
import { deepmerge } from '@mui/utils'

/**
 * Configurações base para os dois temas.
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
        MuiUseMediaQuery: {
            defaultProps: {
                noSsr: true,
            },
        },
    },
}

/** Constrói tema a partir do tema base. */
function buildTheme(options?: ThemeOptions) {
    const merged = deepmerge(baseTheme, options)
    return responsiveFontSizes(createTheme(merged))
}

/** Opções de tema. */
export const THEMES = {
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
