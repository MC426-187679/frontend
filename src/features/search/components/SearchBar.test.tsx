import React from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Discipline } from 'features/discipline'
import SearchBar from './SearchBar'

describe('user input', () => {
    test('changes text value', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>,
        )

        const input = screen.getByPlaceholderText<HTMLInputElement>(/Pesquisar/)
        expect(input).toBeVisible()
        expect(input).toHaveValue('')

        await act(() => userEvent.type(input, 'MC102', { delay: 10 }))
        expect(input).toHaveFocus()
        expect(input).toHaveValue('MC102')
    })

    test('display popper', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>,
        )

        expect(screen.queryByRole('presentation')).toBeNull()
        await act(async () => {
            const input = screen.getByPlaceholderText(/Pesquisar/)
            userEvent.click(input)
            await userEvent.type(input, 'MC426', { delay: 10 })
        })
        const popper = screen.queryByRole('presentation')
        expect(popper).toBeVisible()
    })

    test('display options', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>,
        )
        expect(screen.queryAllByRole('listitem')).toHaveLength(0)

        await act(async () => {
            const input = screen.getByPlaceholderText(/Pesquisar/)
            userEvent.click(input)
            await userEvent.type(input, 'F 128', { delay: 10 })
        })
        const optionList = await screen.findByRole('listbox', {}, { timeout: 2_000 })
        expect(optionList).toBeVisible()

        const options = screen.queryAllByRole('option')
        expect(options.length).toBeGreaterThan(4)
        for (let i = 0; i <= 5; i += 1) {
            expect(options[i]).toBeVisible()
        }
    })

    /** Componente que renderiza rota atual na URL. */
    function DisplayLocation() {
        const { pathname } = useLocation()
        return (
            <div role="status" data-testid="pathname">
                Current path: {pathname}
            </div>
        )
    }

    test('changes navigation', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
                <DisplayLocation />
            </MemoryRouter>,
        )

        const location = screen.getByTestId('pathname')
        expect(location).toHaveTextContent('Current path: /')
        const startLocation = location.textContent ?? ''

        await act(async () => {
            const input = screen.getByPlaceholderText(/Pesquisar/)
            userEvent.click(input)
            await userEvent.type(input, 'MC102', { delay: 10 })
        })
        await screen.findByRole('listbox', {}, { timeout: 2_000 })

        const option = screen.getByText(/Algoritmos\se\sProgramação\sde\sComputadores/)
        expect(option).toBeVisible()
        expect(option.textContent).toEqual(expect.stringMatching('MC102'))

        expect(location).toHaveTextContent(startLocation)
        await act(async () => userEvent.click(option))
        expect(location).toBeInTheDocument()
        expect(location).toHaveTextContent(`Current path: ${Discipline.pagePath('MC102')}`)
    })
})
