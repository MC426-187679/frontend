import React from 'react'
import { Paper, Skeleton, Stack } from '@mui/material'

import type { Discipline, Requirement } from '../types/discipline'
import { Parsing } from '../utils/parsing'
import DisciplineLink from './Link'

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

/** Dados usados durante o loading de {@link Requirements}. */
const loadingData = [{ code: Parsing.code('AA000'), special: true, partial: true }]

/** {@link Skeleton} no formato de {@link Requirements}. */
function LoadingRequirements() {
    return (
        <Skeleton width="100%">
            <RequirementGroup group={loadingData} />
            <RequirementGroup group={loadingData} />
        </Skeleton>
    )
}

/** Um grupo de requisitos, representado por um {@link Paper} com {@link DisciplineLink}s. */
function RequirementGroup({ group }: { group: Requirement.Group }) {
    return (
        <Paper elevation={12}>
            <Stack direction="row" spacing={2} padding={1} role="list">
                {group.map(({ code, special, partial }) => (
                    <DisciplineLink
                        role="listitem"
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
