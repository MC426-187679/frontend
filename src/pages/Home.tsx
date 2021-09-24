import React from 'react'

import './Home.scss'
import AppPage from 'components/AppPage'

/** Página Principal. */
export default function Home() {
    return (
        <AppPage>
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
        </AppPage>
    )
}
