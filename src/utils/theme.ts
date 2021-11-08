/* eslint-disable @typescript-eslint/dot-notation, import/prefer-default-export */
import { ThemeOptions, createTheme, responsiveFontSizes } from '@mui/material/styles'
import { indigo, pink } from '@mui/material/colors'

/**
 * Configurações base para os dois temas.
 *
 * @see https://bareynol.github.io/mui-theme-creator/
 * @see https://material.io/design/color/the-color-system.html Nomes para as cores.
 */
const baseTheme = createTheme({
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
})

/** Constrói tema a partir do tema base. */
function buildTheme(...options: ThemeOptions[]) {
    return responsiveFontSizes(createTheme(...options))
}

/** Opções de tema. */
export const THEMES = {
    light: buildTheme(baseTheme, {
        palette: {
            mode: 'light',
        },
    }),
    dark: buildTheme(baseTheme, {
        palette: {
            mode: 'dark',
        },
    }),
} as const
