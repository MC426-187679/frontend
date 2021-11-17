import React from 'react'
import { Typography, buttonClasses } from '@mui/material'
import { css } from '@emotion/css'

import RouterButton from 'components/RouterButton'

import type { Requirement } from '../types/discipline'
import { disciplineURL } from '../utils/params'

/** Classe CSS para {@link RouterButton}. */
const baseClass = css`
    width: 12ex;

    &.${buttonClasses.disabled} {
        pointer-events: inherit;
        cursor: auto;
        user-select: text;
    }
`

/** Classe CSS com um `'*'` antes do texto. */
const withMarker = css`
    ::before {
        content: '*';
        position: relative;
        left: -1ex;
    }
`

export interface DisciplineLinkProps extends Partial<Requirement> {
    code: string
}

/**
 * Link de uma disciplina desenhado como botão.
 */
export default function DisciplineLink({ code, partial, special }: DisciplineLinkProps) {
    return (
        <RouterButton
            color="primary"
            variant="contained"
            className={partial ? `${baseClass} ${withMarker}` : baseClass}
            to={special ? undefined : disciplineURL(code)}
            disabled={special}
        >
            <Typography variant="inherit" color="text.primary" component="span">
                { code }
            </Typography>
        </RouterButton>
    )
}
