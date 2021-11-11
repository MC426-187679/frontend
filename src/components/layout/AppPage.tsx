import React from 'react'
import { Container, styled } from '@mui/material'

/** {@link Container} com margem superior. */
const ContainerWithMargin = styled(Container)`
    margin-top: 2ex;
`

interface AppPageProps {
    children: React.ReactNode
}

/**
 *  Desenha uma página do App dentro de um {@link Container} que centraliza o
 * conteúdo horizontalmente.
 */
export default function AppPage({ children }: AppPageProps) {
    return (
        <ContainerWithMargin maxWidth="lg">
            { children }
        </ContainerWithMargin>
    )
}
