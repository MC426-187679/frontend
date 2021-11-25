/* eslint-disable @typescript-eslint/dot-notation */
import { type ThemeOptions, createTheme, lighten, responsiveFontSizes } from '@mui/material/styles'
import { indigo, pink } from '@mui/material/colors'
import { ptBR } from '@mui/material/locale'
import { deepmerge } from '@mui/utils'

/** Opções de tema. */
export namespace Themes {
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
        return responsiveFontSizes(createTheme(merged, ptBR))
    }

    /** Opção de tema claro. */
    export const light = buildTheme({
        palette: {
            mode: 'light',
            background: {
                default: lighten(indigo['500'], 0.9),
            },
        },
    })

    /** Opção de tema escuro. */
    export const dark = buildTheme({
        palette: {
            mode: 'dark',
        },
    })
}
