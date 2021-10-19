import React from 'react'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Skeleton,
    Typography,
} from '@mui/material'

import './Page.scss'
import AppPage from 'components/layout/AppPage'
import ApiLoader from 'components/loader/ApiLoader'
import { Discipline } from 'models/discipline'

import DisciplineLink from './Link'
import { PAGE_PATH, Match, fetchDisciplineFrom } from './params'
// Reexporta para o `Router`
export { PAGE_PATH as DISCIPLINE_PATH }

interface DisciplinePageProps {
    match: Match
}

/**
 * Página das Disciplinas: mostra dados da disciplina atual (recuperada da URL) ou uma mensagem
 *  de erro.
 */
export default function DisciplinePage({ match }: DisciplinePageProps) {
    return (
        <AppPage>
            <ApiLoader
                item={match.params.code}
                formatURL={fetchDisciplineFrom}
                parser={Discipline.parser}
                redirect404
                render={(data) => <DisciplineCard discipline={data} />}
                onError={(error) => <>{ `${error}` }</>}
            />
        </AppPage>
    )
}

interface DisciplineCardProps {
    discipline?: Discipline | undefined
}

/**
 * Cartão com os dados da disciplina atual e links para as disciplinas relacionadas (TODO).
 */
function DisciplineCard({ discipline }: DisciplineCardProps) {
    return (
        <Card className="discipline-card" color="inherit" raised>
            <CardContent>
                <Typography className="code" color="text.secondary" gutterBottom>
                    { discipline?.code ?? <Skeleton width="5em" /> }
                </Typography>
                <Typography variant="h5" component="div">
                    { discipline?.name ?? <Skeleton /> }
                </Typography>
                <Requirements groups={discipline?.reqs} />
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    )
}

interface RequirementsProps {
    groups?: Discipline['reqs'] | undefined
}

/**
 * Lista de requisitos da disciplina ou um aviso que não há pré-requisitos.
 */
function Requirements({ groups }: RequirementsProps) {
    let headerContent: string | JSX.Element
    if (groups === undefined) {
        headerContent = <Skeleton />
    } else if (groups.length === 0) {
        headerContent = 'Sem pré-requisitos.'
    } else {
        headerContent = 'Pré-requisitos:'
    }
    const header = (
        <Typography variant="body2" className="requirements">
            { headerContent }
        </Typography>
    )
    if (!groups?.length) {
        return header
    }

    const lists = groups.map((group, idx) => {
        const items = group.map(({ code, special, partial }) => (
            <DisciplineLink key={code} code={code} special={special} partial={partial} />
        ))

        const conjunction = (idx > 0) && 'Ou:'
        return <p key={idx.toString(16)}>{ conjunction }{ items }</p>
    })
    return <>{ header }{ lists }</>
}
