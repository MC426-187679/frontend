import React from 'react'
import { Link as RouterLink, match as Match } from 'react-router-dom'
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
import { Disciplina, GrupoDeRequisitos, Requisito, parseDisciplina } from 'utils/types/disciplinas'

import { PATH, DIRECTORY, CourseParam, disciplinaURL } from './params'
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
                <Requisitos groups={disciplina?.req} />
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    )
}

interface RequisitosProps{
    groups?: ReadonlyArray<GrupoDeRequisitos> | undefined
}

/**
 * Lista de requisitos da disciplina ou
 * um aviso que não há pré-requisitos.
 */
function Requisitos({ groups }: RequisitosProps) {
    let headerContent: string | JSX.Element
    if (groups === undefined) {
        headerContent = <Skeleton />
    } else if (groups.length === 0) {
        headerContent = 'Sem pré-requisitos.'
    } else {
        headerContent = 'Pré-requisitos:'
    }
    const header = (
        <Typography variant="body2" className="Requisitos">
            { headerContent }
        </Typography>
    )
    if (!groups?.length) {
        return header
    }

    const lists = groups.map((group, idx) => {
        const items = group.map((req) => (
            <RequisitoBtn req={req} key={req.code} />
        ))

        const conjunction = (idx > 0) && 'Ou:'
        return <p key={idx.toString(16)}>{ conjunction }{ items }</p>
    })
    return <>{ header }{ lists }</>
}

interface RequisitoBtnProps {
    req: Requisito
}

function RequisitoBtn({ req: { code, partial, special } }: RequisitoBtnProps) {
    const classes = partial ? 'RequisitoBtn Partial' : 'RequisitoBtn'

    const props: { component?: typeof RouterLink, to?: string } = {}
    if (!special) {
        props.component = RouterLink
        props.to = disciplinaURL(code)
    }
    return (
        <Button
            color="primary"
            variant="contained"
            className={classes}
            disabled={special}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        >
            { code }
        </Button>
    )
}
