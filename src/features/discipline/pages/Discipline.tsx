import React from 'react'
import { Redirect } from 'react-router-dom'

import AppPage from 'components/AppPage'
import { useApi, FetchState } from 'hooks/useApi'
import { SendError } from 'features/error-messages'

import DisciplineCard from '../components/Card'
import { PAGE_PATH, MatchParams } from '../utils/params'
import { Discipline } from '../types/discipline'

interface DisciplinePageProps {
    match: MatchParams
}

/**
 * Página das Disciplinas: mostra dados da disciplina atual (recuperada da URL) ou uma mensagem
 *  de erro.
 */
function DisciplinePage({ match: { params: { code } } }: DisciplinePageProps) {
    return (
        <AppPage title={code}>
            <DisciplineContent code={code} />
        </AppPage>
    )
}

namespace DisciplinePage {
    /** Reexportado para o `Router` */
    export const PATH = PAGE_PATH
}
export default DisciplinePage

interface DisciplineContentProps {
    code: string
}

/** Conteúdo da página de disciplinas. */
function DisciplineContent({ code }: DisciplineContentProps) {
    const content = useApi(code, Discipline.fetch)

    // página com conteúdo
    if (content.state !== FetchState.Error) {
        const discipline = content as { data?: Discipline }
        return <DisciplineCard discipline={discipline?.data} />
    // redireciona para página de erro
    // TODO: usar PATH da página (futura) de 404
    } else if (content.is404) {
        return <Redirect to="/404" />
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
