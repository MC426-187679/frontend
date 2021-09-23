import React from 'react'

import './Home.scss'
import { withPath } from 'utils/helpers/routes'

/** URL para a página principal. */
export const HOME_PATH = '/'

/** Página Principal. */
const Home = withPath(HOME_PATH, () => {
    return (
        <header className="App-Home">
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
    )
})
export default Home
