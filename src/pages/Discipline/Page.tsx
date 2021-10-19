import React from 'react'

import AppPage from 'components/layout/AppPage'
import ApiLoader from 'components/loader/ApiLoader'
import { Discipline } from 'models/Discipline'

import DisciplineCard from './Card'
import { PAGE_PATH, Match } from './params'

interface DisciplinePageProps {
    match: Match
}

/**
 * Página das Disciplinas: mostra dados da disciplina atual (recuperada da URL) ou uma mensagem
 *  de erro.
 */
function DisciplinePage({ match }: DisciplinePageProps) {
    return (
        <AppPage>
            <ApiLoader
                item={match.params.code}
                fetch={Discipline.fetch}
                redirect404
                render={(data) => <DisciplineCard discipline={data} />}
                onError={(error) => <>{ `${error}` }</>}
            />
        </AppPage>
    )
}

namespace DisciplinePage {
    // Reexporta para o `Router`
    export const PATH = PAGE_PATH
}
export default DisciplinePage
