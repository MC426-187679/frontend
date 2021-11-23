import React from 'react'
import { render, screen } from '@testing-library/react'

import App from './App'

test('renders learn react link', () => {
    render(<App />)

    const linkElement = screen.getByText(/learn react/i)
    expect(linkElement).toBeInTheDocument()
    expect(window.mocks.useMediaQuery).toHaveBeenCalledTimes(3)
})

test('has search bar', () => {
    render(<App />)

    const searchBar = screen.getByPlaceholderText<HTMLInputElement>(/Pesquisar/)
    expect(searchBar).toBeInTheDocument()
    expect(searchBar).toBeVisible()
})
