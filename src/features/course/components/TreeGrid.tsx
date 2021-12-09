import React from 'react'
import { Grid, Paper, Skeleton, Stack } from '@mui/material'
import { css } from '@emotion/css'

import { DisciplineLink } from 'features/discipline'

import type { Tree } from '../types/course'

interface TreeGridProps {
    tree?: Tree
}

export default function TreeGrid({ tree }: TreeGridProps) {
    const semesters = tree ?? Array<undefined>(10).fill(undefined)

    return (
        <Stack direction="column" spacing={2}>
            {semesters.map((semester, idx) => (
                <Semester
                    key={idx.toString(16)}
                    semester={semester}
                    maxCredits={tree?.credits.max}
                />
            ))}
        </Stack>
    )
}

const skeletonProps = { component: Skeleton, width: '100%' } as const

interface SemesterProps {
    semester?: Tree.SemesterGroup
    maxCredits?: number
}

function Semester({ semester, maxCredits }: SemesterProps) {
    const isLoading = !semester
    const title = semester && `${semester.name} - ${formatCredits(semester.credits.total)}`
    return (
        <Paper elevation={12} {...(isLoading ? skeletonProps : {})} title={title}>
            <Grid
                container
                direction="row"
                spacing={2}
                padding={1}
                columns={maxCredits}
                role="list"
            >
                {isLoading && (
                    <Discipline key="loading" credits={2} code="AA000" />
                )}
                {semester?.disciplines.map(({ code, credits }) => (
                    <Discipline key={code} credits={credits} code={code} />
                ))}
                {semester?.electives && (
                    <Discipline key="electives" elective credits={semester.electives} />
                )}
            </Grid>
        </Paper>
    )
}

type DisciplineProps = {
    code: string
    special?: boolean
    credits: number
    elective?: false
} | {
    elective: true
    credits: number
}

const noPadding = css`
    min-width: unset;
    padding-left: 0;
    padding-right: 0;
`

function Discipline({ credits, ...props }: DisciplineProps) {
    const text = props.elective ? 'Eletivo' : props.code

    return (
        <Grid item xs={credits}>
            <DisciplineLink
                className={noPadding}
                role="listitem"
                special={props.elective || props.special}
                code={text}
                title={formatCredits(credits)}
                fullWidth
            />
        </Grid>
    )
}

function formatCredits(credits?: number) {
    if (typeof credits === 'number' && Number.isInteger(credits) && credits > 0) {
        return `${credits} Crédito${credits > 1 ? 's' : ''}`
    } else {
        return undefined
    }
}
