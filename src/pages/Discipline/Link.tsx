import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button } from '@mui/material'

import './Link.scss'
import { disciplineURL } from './params'

interface DisciplineLinkProps {
    code: string
    partial?: boolean | undefined
    special?: boolean | undefined
}

export default function DisciplineLink({ code, partial, special = false }: DisciplineLinkProps) {
    const classes = partial ? 'discipline-link partial' : 'discipline-link'

    return (
        <Button
            color="primary"
            variant="contained"
            className={classes}
            disabled={special}
            component={RouterLink}
            to={disciplineURL(code)}
        >
            { code }
        </Button>
    )
}
