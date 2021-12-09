import React from 'react'
import { Paper, Skeleton, Stack } from '@mui/material'

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
                <Semester key={idx.toString(16)} semester={semester} />
            ))}
        </Stack>
    )
}

const skeletonProps = { component: Skeleton, width: '100%' } as const

function Semester({ semester }: { semester?: Tree.Semester }) {
    const isLoading = !semester
    return (
        <Paper elevation={12} {...(isLoading ? skeletonProps : {})}>
            <Stack direction="row" spacing={2} padding={1} role="list">
                {isLoading && <DisciplineLink role="listitem" code="AA000" special />}
                {semester?.disciplines.map(({ code }) => (
                    <DisciplineLink role="listitem" key={code} code={code} />
                ))}
            </Stack>
        </Paper>
    )
}
