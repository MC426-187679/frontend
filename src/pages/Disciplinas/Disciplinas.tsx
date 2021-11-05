import React from 'react'
import { match as Match } from 'react-router-dom'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Skeleton,
    Typography,
} from '@mui/material'

import './Disciplinas.scss'
import AppPage from 'components/layout/AppPage'
import ApiLoader from 'components/loader/ApiLoader'
import { Disciplina, parseDisciplina } from 'utils/types/disciplinas'
import Requisitos from './Requisitos'

import { PATH, DIRECTORY, CourseParam } from './params'
// Reexporta para o `Router`
export { PATH as DISCIPLINAS_PATH }

interface DisciplinasProps {
    match: Match<CourseParam>
}

/**
 * Página das Disciplinas: mostra dados
 *  da disciplina atual (recuperada da URL)
 *  ou uma mensagem de erro
 */
export default function Disciplinas({ match }: DisciplinasProps) {
    return (
        <AppPage>
            <ApiLoader
                dir={DIRECTORY}
                item={match.params.code}
                parser={parseDisciplina}
                redirect404
                render={(data) => <DisciplinaCard disciplina={data} />}
                onError={(error) => <>{ `${error}` }</>}
            />
        </AppPage>
    )
}

interface DisciplinaCardProps {
    disciplina?: Disciplina | undefined
}

/**
 * Cartão com os dados da disciplina atual
 * e links para as disciplinas relacionadas (TODO).
 */
function DisciplinaCard({ disciplina }: DisciplinaCardProps) {
    return (
        <Card className="DisciplinaCard" color="inherit" raised>
            <CardContent>
                <Typography className="Code" color="text.secondary" gutterBottom>
                    { disciplina?.code ?? <Skeleton width="5em" /> }
                </Typography>
                <Typography variant="h5" component="div">
                    { disciplina?.name ?? <Skeleton /> }
                </Typography>
                <Requisitos groups={disciplina?.reqs} />
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    )
}
