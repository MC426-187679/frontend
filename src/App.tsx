import React from 'react'
import { Switch, Route } from 'react-router-dom'

import HeaderBar from 'components/header/HeaderBar'

import Home from 'pages/Home'
import Search from 'pages/Search/Search'
import Disciplinas from 'pages/Disciplinas/Disciplinas'

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
                <Route path={Home.path} exact>
                    <Home />
                </Route>
                {/* Página de Busca */}
                <Route path={Search.path} exact>
                    <Search />
                </Route>
                {/* Páginas de cada Disciplina */}
                <Route path={Disciplinas.path} exact>
                    <Disciplinas />
                </Route>
            </Switch>
        </>
    )
}
