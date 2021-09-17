import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { Container } from '@mui/material'

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
                    <AppPage>
                        <Home />
                    </AppPage>
                </Route>
                {/* Página de Busca */}
                <Route path={Search.path} exact>
                    <AppPage>
                        <Search />
                    </AppPage>
                </Route>
                {/* Páginas de cada Disciplina */}
                <Route path={Disciplinas.path} exact>
                    <AppPage>
                        <Disciplinas />
                    </AppPage>
                </Route>
            </Switch>
        </>
    )
}

interface AppPageProps {
    children: JSX.Element
}

/**
 *  Desenha uma página do App dentro de
 * um {@link Container} que centraliza o
 * conteúdo horizontalmente.
 */
function AppPage({ children }: AppPageProps) {
    return (
        <Container maxWidth="sm">
            { children }
        </Container>
    )
}
