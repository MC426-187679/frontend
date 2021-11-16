import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, NoSsr, StyledEngineProvider } from '@mui/material'

import ThemeProvider from 'providers/Theme'
import App from './App'

/** Página completa. */
ReactDOM.render(
    <StrictMode>
        <StyledEngineProvider injectFirst>
            <NoSsr>
                <ThemeProvider defaultMode="dark" storageKey="theme-mode">
                    <BrowserRouter>
                        <CssBaseline />
                        <App />
                    </BrowserRouter>
                </ThemeProvider>
            </NoSsr>
        </StyledEngineProvider>
    </StrictMode>,
    document.getElementById('root'),
)
