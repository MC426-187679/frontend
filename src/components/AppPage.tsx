import React, { type ReactNode, useEffect } from 'react'
import { Container } from '@mui/material'
import { css } from '@emotion/css'

/** Classe CSS com margem superior. */
const withMargin = css`
    margin-top: 2ex;
`

/** Propriedades do título. */
type TitleProps = {
    /** Título da página. */
    title: string
} | {
    /** Página sem mudança de título. */
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
            return undefined
        } else {
            // retorna o título base
            document.title = `${baseTitle} - ${title}`
            return () => {
                document.title = baseTitle
            }
        }
    }, [title, notitle])

    return (
        <Container className={withMargin} maxWidth="lg" component="main">
            { children }
        </Container>
    )
}
