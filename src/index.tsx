import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'

import ThemeModeProvider from 'components/loader/ThemeModeProvider'
import App from './App'

/** Página completa. */
ReactDOM.render(
    <StrictMode>
        <StyledEngineProvider injectFirst>
            <ThemeModeProvider defaultMode="light">
                <BrowserRouter>
                    <CssBaseline />
                    <App />
                </BrowserRouter>
            </ThemeModeProvider>
        </StyledEngineProvider>
    </StrictMode>,
    document.getElementById('root'),
)
