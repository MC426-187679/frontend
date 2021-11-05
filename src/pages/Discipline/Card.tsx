import React from 'react'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Skeleton,
    Typography,
} from '@mui/material'

import './Card.scss'
import type { Discipline } from 'models/discipline'

import DisciplineLink from './Link'

interface DisciplineCardProps {
    discipline?: Discipline | undefined
}

/**
 * Cartão com os dados da disciplina atual e links para as disciplinas relacionadas (TODO).
 */
export default function DisciplineCard({ discipline }: DisciplineCardProps) {
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
    return (
        <>
            <Typography variant="body2" className="requirements">
                <RequirementsHeader groups={groups} />
            </Typography>
            <RequirementsBody groups={groups ?? []} />
        </>
    )
}

function RequirementsHeader({ groups }: RequirementsProps) {
    switch (groups?.length) {
        case undefined:
            return <Skeleton />
        case 0:
            return <>Sem pré-requisitos.</>
        default:
            return <>Pré-requisitos:</>
    }
}

interface RequirementsBodyProps {
    groups: Discipline['reqs']
}

function RequirementsBody({ groups }: RequirementsBodyProps) {
    return (
        <>
            {groups.map((group, idx) => {
                const items = group.map(({ code, special, partial }) => (
                    <DisciplineLink
                        key={code}
                        code={code}
                        special={special}
                        partial={partial}
                    />
                ))

                return (
                    <p key={idx.toString(16)}>
                        { (idx > 0) && 'Ou:' }
                        { items }
                    </p>
                )
            })}
        </>
    )
}
