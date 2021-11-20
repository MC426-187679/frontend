import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { CssBaseline, NoSsr, StyledEngineProvider } from '@mui/material'

import ThemeProvider from 'providers/Theme'

import App from './App'

/** Renderiza página completa. */
ReactDOM.render(
    <StrictMode>
        <NoSsr>
            <StyledEngineProvider injectFirst>
                <CssBaseline enableColorScheme>
                    <ThemeProvider storageKey="theme-mode">
                        <App />
                    </ThemeProvider>
                </CssBaseline>
            </StyledEngineProvider>
        </NoSsr>
    </StrictMode>,
    document.getElementById('root'),
)
