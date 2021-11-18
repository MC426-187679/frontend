import React from 'react'
import { Navigate } from 'react-router-dom'

import AppPage from 'components/AppPage'
import { useApi, FetchState } from 'hooks/useApi'
import { PageComponent } from 'utils/params'
import { SendError } from 'features/error-messages'

import DisciplineCard from '../components/Card'
import { PAGE_PATH, Params } from '../utils/params'
import { Discipline } from '../types/discipline'

/**
 * Página das Disciplinas: mostra dados da disciplina atual (recuperada da URL) ou uma mensagem
 *  de erro.
 */
export default PageComponent.from(
    function DisciplinePage({ code }: Params) {
        return (
            <AppPage title={code}>
                <DisciplineContent code={code} />
            </AppPage>
        )
    },
    { path: PAGE_PATH },
)

/** Conteúdo da página de disciplinas. */
function DisciplineContent({ code }: Params) {
    const content = useApi(code, Discipline.fetch)

    // página com conteúdo
    if (content.state !== FetchState.Error) {
        const discipline = content as { data?: Discipline }
        return <DisciplineCard discipline={discipline?.data} />
    // redireciona para página de erro
    // TODO: usar PATH da página (futura) de 404
    } else if (content.is404) {
        return <Navigate to="/404" replace />
    // página com erro
    } else {
        return (
            <SendError kind="discipline-page" severe>
                Problema de conexão com o servidor: os dados da disciplina {code} puderam ser
                recuperados. Por favor, cheque sua conexão ou tente novamente mais tarde.
            </SendError>
        )
    }
}
