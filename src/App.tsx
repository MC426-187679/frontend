import React from 'react'
import { Route, Switch } from 'react-router-dom'

import AppBar from 'features/appbar'

import Home from 'pages/Home'
import Discipline from 'features/discipline'

/**
 * Componente Principal: cuida do cabeçalho e do switch de roteamento com o conteúdo real da
 *  página.
 */
export default function App() {
    return (
        <>
            <AppBar />
            <Switch>
                {/* Página Principal */}
                <Route path={Home.PATH} exact component={Home} />
                {/* Páginas de cada Disciplina */}
                <Route path={Discipline.PATH} component={Discipline} />
            </Switch>
        </>
    )
}
