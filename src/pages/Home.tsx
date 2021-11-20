import React from 'react'
import { css } from '@emotion/css'

import AppPage from 'components/AppPage'
import { PageComponent } from 'utils/params'

/** Estilo da Home page. */
const home = css`
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
`

/** Página Principal. */
export default PageComponent.from(
    function HomePage() {
        return (
            <AppPage notitle>
                <header className={home}>
                    <p>
                        Edit <code>src/app/App.tsx</code> and save to reload.
                    </p>
                    <a
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </AppPage>
        )
    },
    // Caminho para a página principal.
    { path: '/' },
)
