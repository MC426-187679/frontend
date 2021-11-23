import React from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'

import { mockFetch } from 'test/fetch'
import { mockUseFetch } from 'test/useFetch'

import { Discipline } from '../types/discipline'
import DisciplinePage from './Discipline'

test('fetch and render discipline with valid code', async () => {
    mockFetch()
    await mockUseFetch('MC102', Discipline.fetch)

    render(
        <MemoryRouter initialEntries={['/disciplina/MC102']}>
            <Routes>
                <Route path={DisciplinePage.path} element={<DisciplinePage />} />
            </Routes>
        </MemoryRouter>,
    )

    expect(screen.queryByText(/MC102/)).toBeInTheDocument()
    expect(screen.queryByText(/Algoritmos e Programação de Computadores/)).toBeInTheDocument()
    const syllabus = /Conceitos básicos de organização de computadores. Construção de algoritmos e/
    expect(screen.queryByText(syllabus)).toBeInTheDocument()
    expect(screen.queryByText(/6 Créditos/)).toBeInTheDocument()
    expect(screen.queryByText(/Sem pré-requisitos./)).toBeInTheDocument()
})

test('fetch discipline with code character count bigger than 5', async () => {
    mockFetch()
    await mockUseFetch('MC1022', Discipline.fetch)

    render(
        <MemoryRouter initialEntries={['/disciplina/MC1022']}>
            <Routes>
                <Route path={DisciplinePage.path} element={<DisciplinePage />} />
                <Route path="/404" element={<>404 Not Found</>} />
            </Routes>
        </MemoryRouter>,
    )

    expect(screen.queryByText(/MC1022/)).not.toBeInTheDocument()
    expect(screen.queryByText(/404 Not Found/)).toBeInTheDocument()
})

test('test fetch discipline with code character count lower than 5', async () => {
    mockFetch()
    await mockUseFetch('MC10', Discipline.fetch)

    render(
        <MemoryRouter initialEntries={['/disciplina/MC10']}>
            <Routes>
                <Route path={DisciplinePage.path} element={<DisciplinePage />} />
                <Route path="/404" element={<>404 Not Found</>} />
            </Routes>
        </MemoryRouter>,
    )

    expect(screen.queryByText(/MC10/)).not.toBeInTheDocument()
    expect(screen.queryByText(/404 Not Found/)).toBeInTheDocument()
})

test('test fetch discipline with special cases code', async () => {
    mockFetch()
    await mockUseFetch('AA200', Discipline.fetch)

    render(
        <MemoryRouter initialEntries={['/disciplina/AA200']}>
            <Routes>
                <Route path={DisciplinePage.path} element={<DisciplinePage />} />
                <Route path="/404" element={<>404 Not Found</>} />
            </Routes>
        </MemoryRouter>,
    )

    expect(screen.queryByText(/AA200/)).not.toBeInTheDocument()
    expect(screen.queryByText(/404 Not Found/)).toBeInTheDocument()
})

test('test fetch discipline with lower case code', async () => {
    mockFetch()
    await mockUseFetch('mc102', Discipline.fetch)

    render(
        <MemoryRouter initialEntries={['/disciplina/mc102']}>
            <Routes>
                <Route path={DisciplinePage.path} element={<DisciplinePage />} />
                <Route path="/404" element={<>404 Not Found</>} />
            </Routes>
        </MemoryRouter>,
    )

    expect(screen.queryByText(/mc102/)).not.toBeInTheDocument()
    expect(screen.queryByText(/404 Not Found/)).toBeInTheDocument()
})
