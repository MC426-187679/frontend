/* eslint-disable @typescript-eslint/dot-notation */
import { ThemeOptions } from '@mui/material/styles'
import { indigo, pink } from '@mui/material/colors'

declare module '@mui/material/styles/createPalette' {
    interface PaletteOptions {
        type?: string
    }
}

// See https://bareynol.github.io/mui-theme-creator/
const defaultTheme: ThemeOptions = {
    palette: {
        type: 'light',
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
// Color names can be found at
// https://material.io/design/color/the-color-system.html

export default defaultTheme
