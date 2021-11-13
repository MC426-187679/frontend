import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'

import ThemeProvider from 'providers/Theme'
import App from './App'

/** Página completa. */
ReactDOM.render(
    <StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeProvider defaultMode="dark" storageKey="theme-mode">
                <BrowserRouter>
                    <CssBaseline />
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </StyledEngineProvider>
    </StrictMode>,
    document.getElementById('root'),
)
