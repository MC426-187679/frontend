import React from 'react'
import { Skeleton, Stack, Paper } from '@mui/material'

import type { Code, Discipline, Requirement } from '../types/discipline'
import DisciplineLink from './Link'

/** {@link Skeleton} no formato de {@link Requirements}. */
const LoadingRequirements = React.memo(
    function LoadingRequirements() {
        const someData = { code: 'AA000' as Code, special: true, partial: true }
        return (
            <Skeleton width="100%">
                <RequirementGroup group={[someData]} />
                <RequirementGroup group={[someData]} />
            </Skeleton>
        )
    },
)

interface RequirementsProps {
    /** Grupos de requisitos da disciplina. */
    groups?: Discipline['reqs']
}

/** Bloco de requisitos de uma disciplina. */
export default function Requirements({ groups }: RequirementsProps) {
    if (!groups) {
        return <LoadingRequirements />
    }

    return (
        <Stack direction="column" spacing={2}>
            {groups.map((group, idx) => (
                <RequirementGroup
                    key={idx.toString(16)}
                    group={group}
                />
            ))}
        </Stack>
    )
}

/** Um grupo de requisitos, representado por um {@link Paper} com {@link DisciplineLink}s. */
function RequirementGroup({ group }: { group: Requirement.Group }) {
    return (
        <Paper elevation={12}>
            <Stack direction="row" spacing={2} padding={1}>
                {group.map(({ code, special, partial }) => (
                    <DisciplineLink
                        key={code}
                        code={code}
                        special={special}
                        partial={partial}
                    />
                ))}
            </Stack>
        </Paper>
    )
}
