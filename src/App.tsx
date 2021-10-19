/* eslint-disable react/jsx-max-props-per-line, react/jsx-first-prop-new-line */
import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HeaderBar from 'components/header/HeaderBar'

import Home from 'pages/Home'
import Search from 'pages/Search/Page'
import Discipline from 'pages/Discipline/Page'

/**
 * Componente Principal: cuida do cabeçalho e do switch de roteamento com o conteúdo real da
 *  página.
 */
export default function App() {
    return (
        <>
            <HeaderBar />
            <Switch>
                {/* Página Principal */}
                <Route path={Home.PATH} exact>
                    <Home />
                </Route>
                {/* Página de Busca */}
                <Route path={Search.PATH}
                    render={({ location }) => <Search location={location} />}
                />
                {/* Páginas de cada Disciplina */}
                <Route path={Discipline.PATH}
                    render={({ match }) => <Discipline match={match} />}
                />
            </Switch>
        </>
    )
}
