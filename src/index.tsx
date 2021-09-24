import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import {
    ThemeProvider,
    StyledEngineProvider,
    createTheme,
    responsiveFontSizes,
} from '@mui/material/styles'

import themeOptions from 'utils/theme'
import App from './App'

const theme = responsiveFontSizes(createTheme(themeOptions))

/** Página completa. */
ReactDOM.render(
    <StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <BrowserRouter>
                    <CssBaseline />
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </StyledEngineProvider>
    </StrictMode>,
    document.getElementById('root'),
)
