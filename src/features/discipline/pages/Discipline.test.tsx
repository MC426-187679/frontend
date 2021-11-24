import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { screen, render, waitFor } from '@testing-library/react'

import { Discipline } from '../types/discipline'
import DisciplinePage from './Discipline'

describe('fetch discipline', () => {
    /** Renderiza uma página de dsiciplina e o resultado de sua requisição. */
    async function loadDisciplinePage(code: string) {
        render(
            <MemoryRouter initialEntries={[Discipline.pagePath(code)]}>
                <Routes>
                    <Route path={DisciplinePage.path} element={<DisciplinePage />} />
                    <Route path="/404" element={<>404 Not Found</>} />
                </Routes>
            </MemoryRouter>,
        )

        await waitFor(() => {
            expect(screen.queryByText(RegExp(`${code}|Not Found`))).toBeInTheDocument()
        })
    }

    test('with valid code', async () => {
        await loadDisciplinePage('MC102')

        expect(document.title).toEqual(expect.stringContaining('MC102'))
        expect(screen.queryByText(/MC102/)).toBeInTheDocument()
        expect(screen.queryByText(/Algoritmos e Programação de Computadores/)).toBeInTheDocument()
        const syllabus = /Conceitos básicos de organização de computadores./
        expect(screen.queryByText(syllabus)).toBeInTheDocument()
        expect(screen.queryByText(/6 Créditos/)).toBeInTheDocument()
        expect(screen.queryByText(/Sem pré-requisitos./)).toBeInTheDocument()
    })

    test.each([
        ['code character count bigger than 5', 'MC1022'],
        ['code character count lower than 5', 'MC10'],
        ['special cases code', 'AA200'],
        ['lower case code', 'mc102'],
    ])('with %s', async (message, code) => {
        await loadDisciplinePage(code)

        expect(document.title).toEqual(expect.not.stringContaining(code))
        expect(screen.queryByText(RegExp(code))).not.toBeInTheDocument()
        expect(screen.queryByText(/404 Not Found/)).toBeInTheDocument()
    })
})
