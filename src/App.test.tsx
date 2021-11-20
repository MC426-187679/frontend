import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

import App from './App'

/** CUIDADO: Teste desatualizado! */
test('renders learn react link', () => {
    render(
        <ThemeProvider theme={createTheme()}>
            <App />
        </ThemeProvider>,
    )

    const linkElement = screen.getByText(/learn react/i)
    expect(linkElement).toBeInTheDocument()
    expect(window.matchMediaMock).toHaveBeenCalledTimes(3)
})
