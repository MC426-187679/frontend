import React from 'react'
import { styled } from '@mui/material'

import AppPage from 'components/layout/AppPage'

/** `header` com estilo da Home page. */
const HomeHeader = styled('header')`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
`

/** Página Principal. */
function HomePage() {
    return (
        <AppPage>
            <HomeHeader>
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
            </HomeHeader>
        </AppPage>
    )
}

namespace HomePage {
    /** Caminho para a página principal. */
    export const PATH = '/'
}
export default HomePage
