import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    Button,
    Link,
    Typography,
} from '@mui/material'

import { withPath } from '../routes'
import { Disciplina, GrupoDeRequisitos } from './disciplinas'
import { DISCIPLINAS_PATH, disciplinaURL, useDisciplina } from './params'

/**
 * Página das Disciplinas: mostra dados
 *  da disciplina atual (recuperada da URL)
 *  ou uma mensagem de erro
 */
const Disciplinas = withPath(DISCIPLINAS_PATH, () => {
    const data = useDisciplina()

    switch (data?.kind) {
        case 'course':
            return <DisciplinaCard disciplina={data.disc} />
        case 'error':
            return <>{ `${data.error}` }</>
        default:
            return <CircularProgress />
    }
})
export default Disciplinas

interface DisciplinaCardProps {
    disciplina: Disciplina
}

/**
 * Cartão com os dados da disciplina atual
 * e links para as disciplinas relacionadas (TODO).
 */
function DisciplinaCard({ disciplina }: DisciplinaCardProps) {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    { disciplina.code }
                </Typography>
                <Typography variant="h5" component="div">
                    { disciplina.name }
                </Typography>
                <Typography variant="body2">
                    <Requisitos groups={disciplina.req} />
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    )
}

interface RequisitosProps{
    groups: ReadonlyArray<GrupoDeRequisitos>
}

/**
 * Lista de requisitos da disciplina ou
 * um aviso que não há pré-requisitos.
 */
function Requisitos({ groups }: RequisitosProps) {
    if (groups.length === 0) {
        return <>Sem pré-requisitos.</>
    }

    const lists = groups.map((group, idx) => {
        const items = group.map(({ code, partial, special }) => {
            // requisitos especiais: AA200, AA480, ...
            if (special) {
                return <div key={code}>{code}</div>
            // requisitos gerais podem ser linkados
            } else {
                return (
                    <Link component={RouterLink} to={disciplinaURL(code)} key={code}>
                        { partial ? '(*)' : '' } { code }
                    </Link>
                )
            }
        })

        return <p key={idx.toString(16)}>{ items }</p>
    })
    return <>{ lists }</>
}
