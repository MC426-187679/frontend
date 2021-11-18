import React, { ReactNode } from 'react'
import { Card, CardContent, Chip, Skeleton, Stack, Typography } from '@mui/material'
import { css } from '@emotion/css'

import type { Discipline } from '../types/discipline'
import Requirements from './Requirements'
import DisciplineLink from './Link'

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
                <Typography variant="h6" color="text.secondary" gutterBottom>
                    { discipline?.code ?? <Skeleton width="5em" /> }
                </Typography>
                {/* Nome da disciplina. */}
                <Typography variant="h4" component="div">
                    { discipline?.name ?? <Skeleton /> }
                </Typography>
                {/* Ementa. */}
                <Typography variant="body1" paragraph marginY="2ex" color="text.secondary">
                    { discipline?.syllabus ?? <Skeleton height="3em" /> }
                </Typography>
                {/* Créditos. */}
                <Typography variant="body1" component="div">
                    <Credits value={discipline?.credits} />
                </Typography>
                {/* Título da seção de requisitos. */}
                <SectionHeader>
                    <RequirementsHeader count={discipline?.reqs?.length} />
                </SectionHeader>
                {/* Grupos de requisitos. */}
                <Requirements groups={discipline?.reqs} />
                {/* Disciplinas que tem esta como requisito. */}
                <RequiredBy codes={discipline?.reqBy} />
            </CardContent>
        </Card>
    )
}

/** {@link Chip} que descreve a quantidade de créditos da dsiciplina. */
function Credits({ value }: { value?: number }) {
    if (value === undefined) {
        return <Skeleton width="12ch" />
    } else {
        return (
            <Chip
                label={`${value} Créditos`}
                variant="outlined"
                size="medium"
            />
        )
    }
}

/** {@link Typography} com formatação de header e com margem. */
function SectionHeader({ children }: { children?: ReactNode }) {
    return (
        <Typography
            variant="h6"
            color="text.secondary"
            marginTop="1ex"
            marginBottom="0.5ex"
        >
            { children }
        </Typography>
    )
}

/** Descrição textual do bloco de requisitos, com base no tamanho do vetor. */
function RequirementsHeader({ count }: { count?: number }) {
    switch (count) {
        case undefined:
            return <Skeleton width="15ch" />
        case 0:
            return <>Sem pré-requisitos.</>
        default:
            return <>Pré-requisitos:</>
    }
}

/** Classe CSS para uma margem adicional de {@link RequiredBy}. */
const extraMargin = css`
    margin-top: 2ex;
`

/** Descrição da lista de disciplinas que dependem da atual. */
function RequiredBy({ codes }: { codes?: readonly string[] }) {
    if (!codes?.length) {
        return null
    }

    return (
        <div className={extraMargin}>
            <SectionHeader>
                Essa disciplina pode ser importante para:
            </SectionHeader>
            <Stack direction="row" spacing={2} padding={1}>
                {codes.map((code) => (
                    <DisciplineLink key={code} code={code} />
                ))}
            </Stack>
        </div>
    )
}
