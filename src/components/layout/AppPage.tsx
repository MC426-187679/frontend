import React from 'react'
import { Container } from '@mui/material'

import './AppPage.scss'

interface AppPageProps {
    children: React.ReactNode
}

/**
 *  Desenha uma página do App dentro de um {@link Container} que centraliza o
 * conteúdo horizontalmente.
 */
export default function AppPage({ children }: AppPageProps) {
    return (
        <Container maxWidth="lg" className="app-page">
            { children }
        </Container>
    )
}
