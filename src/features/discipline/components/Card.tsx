import React from 'react'
import { Card, CardContent, Skeleton, Typography } from '@mui/material'
import { css } from '@emotion/css'

import type { Discipline } from '../types/discipline'
import Requirements from './Requirements'

/** Classe CSS que limita o tamanho mínimo do componente. */
const withMinWidth = css`
    min-width: 42ch;
`

interface DisciplineCardProps {
    discipline?: Discipline
}

/**
 * Cartão com os dados da disciplina atual e links para as disciplinas relacionadas (TODO).
 */
export default function DisciplineCard({ discipline }: DisciplineCardProps) {
    return (
        <Card className={withMinWidth} color="inherit" raised>
            <CardContent>
                {/* Código. */}
                <Typography fontSize="14pt" color="text.secondary" gutterBottom>
                    { discipline?.code ?? <Skeleton width="5em" /> }
                </Typography>
                {/* Nome da disciplina. */}
                <Typography variant="h5" component="div">
                    { discipline?.name ?? <Skeleton /> }
                </Typography>
                {/* Título da seção de requisitos. */}
                <Typography variant="body2" marginTop="2ex">
                    <RequirementsHeader count={discipline?.reqs?.length} />
                </Typography>
                {/* Grupos de requisitos. */}
                <Requirements groups={discipline?.reqs} />
            </CardContent>
        </Card>
    )
}

interface RequirementsHeaderProps {
    count?: number
}

/** Descrição textual do bloco de requisitos, com base no tamanho do vetor. */
function RequirementsHeader({ count }: RequirementsHeaderProps) {
    switch (count) {
        case undefined:
            return <Skeleton />
        case 0:
            return <>Sem pré-requisitos.</>
        default:
            return <>Pré-requisitos:</>
    }
}
