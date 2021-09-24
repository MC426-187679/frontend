/* eslint-disable react/jsx-max-props-per-line, react/jsx-first-prop-new-line */
import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HeaderBar from 'components/header/HeaderBar'

import Home from 'pages/Home'
import Search, { SEARCH_PATH } from 'pages/Search/Search'
import Disciplinas, { DISCIPLINAS_PATH } from 'pages/Disciplinas/Disciplinas'

/**
 * Componente Principal: cuida do cabeçalho
 *  e do switch de roteamento com o conteúdo
 *  real da página.
 */
export default function App() {
    return (
        <>
            <HeaderBar />
            <Switch>
                {/* Página Principal */}
                <Route path="/" exact>
                    <Home />
                </Route>
                {/* Página de Busca */}
                <Route path={SEARCH_PATH}
                    render={({ location }) => <Search location={location} />}
                />
                {/* Páginas de cada Disciplina */}
                <Route path={DISCIPLINAS_PATH}
                    render={({ match }) => <Disciplinas match={match} />}
                />
            </Switch>
        </>
    )
}
