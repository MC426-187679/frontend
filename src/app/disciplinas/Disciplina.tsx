import React from 'react'
import { useParams } from 'react-router-dom'

import { Card, CardActions, CardContent, Button, Typography } from '@mui/material'

import DISCIPLINAS from './MC.json'

interface DisciplinaParam {
    id: string
}

function loadDisciplina(id: string) {
    return DISCIPLINAS.find(disciplina => (
        disciplina.code === id
    ))
}
export default function Disciplina() {
    const { id } = useParams<DisciplinaParam>()
    const disciplina = loadDisciplina(id)
    if (!disciplina) {
        return (
            <div>
                Disciplina não encontrada.
            </div>
        )
    }
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {disciplina.code}
                </Typography>
                <Typography variant="h5" component="div">
                    {disciplina.name}
                </Typography>
                <Typography variant="body2">
                    <Requisitos grupos={disciplina.req ?? []} />
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">Learn More</Button>
            </CardActions>
        </Card>
    )
}
interface GrupoDeRequisitosProps {
    req: string[]
}
interface RequisitosProps{
    grupos: string[][]
}
function GrupoDeRequisitos({ req }: GrupoDeRequisitosProps) {
    const reqs = req.map(code => (
        <div key={code}>{code}</div>
    ))
    return <p>{reqs}</p>
}
function Requisitos({ grupos }: RequisitosProps) {
    if (grupos.length === 0) {
        return <div>Sem pré-requisitos.</div>
    } else {
        return (
            <>
                {grupos.map((grupo, idx) => (
                    <GrupoDeRequisitos req={grupo} key={idx.toString()} />
                ))}
            </>
        )
    }
}
