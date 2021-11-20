import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import AppBar from 'features/appbar'
import ErrorsDisplay from 'features/error-messages'

import Home from 'pages/Home'
import Discipline from 'features/discipline'

/**
 * Componente Principal: cuida do cabeçalho e do switch de roteamento com o conteúdo real da
 *  página.
 */
export default function App() {
    return (
        <BrowserRouter>
            <AppBar />
            <ErrorsDisplay />
            <Routes>
                {/* Página Principal */}
                <Route path={Home.path} element={<Home />} caseSensitive />
                {/* Páginas de cada Disciplina */}
                <Route path={Discipline.path} element={<Discipline />} caseSensitive />
            </Routes>
        </BrowserRouter>
    )
}
