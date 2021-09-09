import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HeaderBar from './header/HeaderBar'
import Home from './Home'
import Search, { SEARCH_PATH } from './search/Search'

/** Main app routes */
const ROUTES = {
    home: '/',
    search: SEARCH_PATH,
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
                <Route path={ROUTES.search}>
                    <Search />
                </Route>
            </Switch>
        </>
    )
}
