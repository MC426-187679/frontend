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

    const props: { component?: typeof RouterLink, to?: string } = {}
    if (!special) {
        props.component = RouterLink
        props.to = disciplineURL(code)
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
