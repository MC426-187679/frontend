import React from 'react'
import { Route, Switch } from 'react-router-dom'

import HeaderBar from './header/HeaderBar'
import Home, { HOME_PATH } from './Home'
import Search, { SEARCH_PATH } from './search/Search'
import Disciplina, { DISCIPLINAS_PATH } from './disciplinas/Disciplina'

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
                <Route exact path={HOME_PATH}>
                    <Home />
                </Route>
                {/* Página de Busca */}
                <Route path={SEARCH_PATH}>
                    <Search />
                </Route>
                {/* Páginas de cada Disciplina */}
                <Route path={DISCIPLINAS_PATH}>
                    <Disciplina />
                </Route>
            </Switch>
        </>
    )
}
