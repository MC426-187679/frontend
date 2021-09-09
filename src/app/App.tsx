import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HeaderBar from './header/HeaderBar'
import Home from './Home'

/** Main app routes */
const ROUTES = {
    home: '/',
}

/**
 * Main Component: handles the header bar
 *  and the router switch with actual
 *  page content.
 */
export default function App() {
    return (
        <>
            <HeaderBar />
            <Switch>
                <Route exact path={ROUTES.home}>
                    <Home />
                </Route>
            </Switch>
        </>
    )
}
