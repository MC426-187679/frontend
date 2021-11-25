import React from 'react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { Space } from 'utils/string'
import { Discipline } from 'features/discipline'
import SearchBar from './SearchBar'

describe('when user inputs text', () => {
    test('the searchbox changes value', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>,
        )

        const input = screen.getByPlaceholderText(/Pesquisar/)
        expect(input).toBeVisible()
        expect(input).toHaveValue('')

        await act(() => userEvent.type(input, 'MC102', { delay: 10 }))
        expect(input).toHaveFocus()
        expect(input).toHaveValue('MC102')
    })

    test('the component displays a hidden popper', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>,
        )

        expect(screen.queryByRole('presentation')).toBeNull()
        await act(async () => {
            const input = screen.getByPlaceholderText(/Pesquisar/)
            await userEvent.type(input, 'MC426', { delay: 10 })
        })
        const popper = screen.queryByRole('presentation')
        expect(popper).toBeVisible()
    })

    test('the list of options is displayed', async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>,
        )
        expect(screen.queryAllByRole('listitem')).toHaveLength(0)

        await act(async () => {
            const input = screen.getByPlaceholderText(/Pesquisar/)
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
})

/**
 * Constrói regex que dá match com as mesmas palavras de `groups`, mas ignora a quantidade de
 * espaços em branco em cada grupo e ignora todo tipo de texto entre os grupos. Util para texto
 * do HTML, que pode mudar os espaços.
 *
 * @param groups lista de textos cujas palavras devem dar match em ordem.
 * @returns RegExp que ignora quantidade espaços entre palvras.
 */
function wordsMatching(...groups: string[]) {
    const regexGroups = groups.map((group) => {
        return group
            .split(/\s+/)
            .filter((str) => str.length > 0)
            .join('\\s+')
    })
    return new RegExp(regexGroups.join('.*'))
}

describe.each([
    'MC102',
    'MC322',
    'MC558',
    'F 329',
    'MS211',
])('when the user searches for %s', (code) => {
    test(`it displays an option with '${code}'`, async () => {
        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>,
        )

        await act(async () => {
            const input = screen.getByPlaceholderText(/Pesquisar/)
            await userEvent.type(input, code, { delay: 10 })
        })

        const allOptions = await screen.findAllByRole('option', {}, { timeout: 2_000 })
        const optionsWithSameCode = allOptions.filter((option) => {
            return option.textContent?.match(wordsMatching(code))
        })
        expect(optionsWithSameCode).toHaveLength(1)

        const option = optionsWithSameCode[0]
        expect(option).toBeVisible()
        expect(option.textContent).toMatch(Space.withNonBreaking(code))
    })

    test('by name, it displays the expected option', async () => {
        const discipline = await Discipline.fetch(code)
        expect(discipline.code).toBe(Space.withNonBreaking(code))

        render(
            <MemoryRouter>
                <SearchBar />
            </MemoryRouter>,
        )

        await act(async () => {
            const input = screen.getByPlaceholderText(/Pesquisar/)
            await userEvent.type(input, discipline.name, { delay: 10 })
        })

        const allOptions = await screen.findAllByRole('option', {}, { timeout: 2_000 })
        const optionsWithSameName = allOptions.filter((option) => {
            return option.textContent?.match(wordsMatching(discipline.name))
        })
        expect(optionsWithSameName).not.toHaveLength(0)
        const optionsWithSameCode = allOptions.filter((option) => {
            return option.textContent?.match(wordsMatching(code))
        })
        expect(optionsWithSameCode).toHaveLength(1)

        const option = optionsWithSameCode[0]
        expect(option).toBeVisible()
        expect(option.textContent).toMatch(wordsMatching(code, discipline.name))
    })

    /** Componente que renderiza rota atual na URL. */
    function DisplayLocation() {
        const { pathname } = useLocation()
        return (
            <div role="status" data-testid="pathname">
                {pathname}
            </div>
        )
    }

    test('and clicks on the option, the url changes', async () => {
        const discipline = await Discipline.fetch(code)
        expect(discipline.code).toBe(Space.withNonBreaking(code))

        render(
            <MemoryRouter>
                <SearchBar />
                <DisplayLocation />
            </MemoryRouter>,
        )

        const pathname = screen.getByTestId('pathname')
        expect(pathname).toHaveTextContent('/')
        const initialPath = pathname.textContent ?? ''

        await act(async () => {
            const input = screen.getByPlaceholderText(/Pesquisar/)
            await userEvent.type(input, code, { delay: 10 })
        })

        const allOptions = await screen.findAllByRole('option', {}, { timeout: 2_000 })
        const option = allOptions.find((item) => item.textContent?.match(wordsMatching(code)))
        expect(option).not.toBeNull()

        expect(pathname).toHaveTextContent(initialPath)
        await act(async () => userEvent.click(option!))
        expect(pathname).toBeInTheDocument()
        expect(pathname).toHaveTextContent(Discipline.pagePath(code))
    })
})
