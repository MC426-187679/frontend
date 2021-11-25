import React from 'react'
import { render, screen } from '@testing-library/react'

import { mockMatchMedia, mockUseMediaQuery } from 'test/mediaQuery'

import App from './App'

describe('the full application', () => {
    beforeEach(() => {
        mockMatchMedia({
            width: '1800px',
        })
        mockUseMediaQuery()
    })

    test('renders home with a react link', () => {
        render(<App />)

        expect(screen.getByText(/learn react/i)).toBeInTheDocument()
    })

    test('depends on 3 distinct queries', () => {
        render(<App />)

        expect(window.matchMedia).toHaveBeenCalledTimes(3)
        expect(window.mocks?.useMediaQuery).toHaveBeenCalledTimes(3)
    })

    test('has search bar', () => {
        render(<App />)

        const searchBar = screen.getByPlaceholderText(/Pesquisar/)
        expect(searchBar).toBeInTheDocument()
        expect(searchBar).toBeVisible()
    })
})
