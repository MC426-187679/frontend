import React, { ReactNode, useEffect } from 'react'
import { Container, styled } from '@mui/material'

/** {@link Container} com margem superior. */
const ContainerWithMargin = styled(Container)`
    margin-top: 2ex;
`

/** Propriedades do título. */
type TitleProps = {
    title: string
} | {
    notitle: true
}

/** Título inicial da página, antes de alterações. */
const [baseTitle] = document.title.split(' - ')

type AppPageProps = TitleProps & {
    children?: ReactNode
}

/** {@link AppPageProps} de forma opcional. */
interface OptionalProps {
    title?: string
    notitle?: boolean
    children?: ReactNode
}

/**
 *  Desenha uma página do App dentro de um {@link Container} que centraliza o
 * conteúdo horizontalmente e muda o título considerando as entradas.
 */
export default function AppPage(props: AppPageProps) {
    const { children, title, notitle } = props as OptionalProps
    // muda o título da página
    useEffect(() => {
        if (notitle || !title) {
            document.title = baseTitle
        } else {
            document.title = `${baseTitle} - ${title}`
        }
    }, [title, notitle])

    return (
        <ContainerWithMargin maxWidth="lg">
            { children }
        </ContainerWithMargin>
    )
}
