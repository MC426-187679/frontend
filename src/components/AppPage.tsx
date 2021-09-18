import React from 'react'
import { Container } from '@mui/material'

interface AppPageProps {
    children: React.ReactNode
}

/**
 *  Desenha uma página do App dentro de
 * um {@link Container} que centraliza o
 * conteúdo horizontalmente.
 */
export default function AppPage({ children }: AppPageProps) {
    return (
        <Container maxWidth="sm">
            { children }
        </Container>
    )
}
