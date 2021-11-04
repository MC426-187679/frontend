import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, Skeleton, Typography } from '@mui/material'

import { GrupoDeRequisitos, Requisito } from 'utils/types/disciplinas'

import { disciplinaURL } from './params'

interface RequisitosProps{
    groups?: ReadonlyArray<GrupoDeRequisitos> | undefined
}

/**
 * Lista de requisitos da disciplina ou
 * um aviso que não há pré-requisitos.
 */
export default function Requisitos({ groups }: RequisitosProps) {
    return (
        <>
            <Typography variant="body2" className="Requisitos">
                <Header groups={groups} />
            </Typography>
            <Body groups={groups ?? []} />
        </>
    )
}

function Header({ groups }: RequisitosProps) {
    switch (groups?.length) {
        case undefined:
            return <Skeleton />
        case 0:
            return <>Sem pré-requisitos.</>
        default:
            return <>Pré-requisitos:</>
    }
}

interface BodyProps{
    groups: ReadonlyArray<GrupoDeRequisitos>
}

function Body({ groups }: BodyProps) {
    return (
        <>
            {
                groups.map((group, idx) => {
                    const items = group.map((req) => (
                        <RequisitoBtn req={req} key={req.code} />
                    ))

                    const conjunction = (idx > 0) && 'Ou:'
                    return <p key={idx.toString(16)}>{ conjunction }{ items }</p>
                })
            }
        </>
    )
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
