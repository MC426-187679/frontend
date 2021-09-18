import React from 'react'
import { Switch, Route } from 'react-router-dom'

import HeaderBar from './header/HeaderBar'
import Home from './Home'
import Search from './search/Search'
import Disciplinas from './disciplinas/Disciplinas'

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
