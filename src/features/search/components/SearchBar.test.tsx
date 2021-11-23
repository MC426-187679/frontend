import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { act, fireEvent, render, screen } from '@testing-library/react'

import SearchBar from './SearchBar'

test('input changes value', async () => {
    render(
        <MemoryRouter>
            <SearchBar />
        </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText<HTMLInputElement>(/Pesquisar/)
    act(() => {
        fireEvent.focus(input)
        fireEvent.click(input)
        fireEvent.keyPress(input, { key: 'M', code: 'KeyM' })
        fireEvent.keyPress(input, { key: 'C', code: 'KeyC' })
    })
    expect(input).toHaveValue('')
})
