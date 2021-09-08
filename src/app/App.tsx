import React from 'react'
import './App.scss'
import HeaderBar from './header/HeaderBar'

/**
 * Main Component: handles the header bar
 *  and the router switch (TODO)
 */
export default function App() {
    return (
        <>
            <HeaderBar />
            <header className="App-header">
                <p>
                    Edit <code>src/app/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </>
    )
}
