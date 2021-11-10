import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HeaderBar from 'components/header/HeaderBar'

import Home from 'pages/Home'
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
                {/* Páginas de cada Disciplina */}
                <Route path={Discipline.PATH} component={Discipline} />
            </Switch>
        </>
    )
}
