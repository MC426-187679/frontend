import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import { mockFetch, mockUseFetch } from 'test/fetch'

import { Discipline } from '../types/discipline'
import DisciplinePage from './Discipline'

describe('fetch discipline', () => {
    beforeEach(() => {
        mockFetch()
    })

    test('with valid code', async () => {
        await mockUseFetch('MC102', Discipline.fetch)

        render(
            <MemoryRouter initialEntries={['/disciplina/MC102']}>
                <Routes>
                    <Route path={DisciplinePage.path} element={<DisciplinePage />} />
                    <Route path="/404" element={<>404 Not Found</>} />
                </Routes>
            </MemoryRouter>,
        )

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
        await mockUseFetch(code, Discipline.fetch)

        render(
            <MemoryRouter initialEntries={[`/disciplina/${code}`]}>
                <Routes>
                    <Route path={DisciplinePage.path} element={<DisciplinePage />} />
                    <Route path="/404" element={<>404 Not Found</>} />
                </Routes>
            </MemoryRouter>,
        )

        expect(screen.queryByText(code)).not.toBeInTheDocument()
        expect(screen.queryByText(/404 Not Found/)).toBeInTheDocument()
    })
})
