import React from 'react'
import { Tooltip, TooltipProps, buttonClasses, styled } from '@mui/material'
import { css } from '@emotion/css'

import RouterButton from 'components/RouterButton'

import type { Requirement } from '../types/discipline'
import { disciplineURL } from '../utils/params'

/** {@link RouterButton} com largura fixa e menos efeito quando `disabled={true}`. */
const DisciplineButton = styled(RouterButton)(({ theme }) => ({
    width: '12ex',

    [`&.${buttonClasses.disabled}`]: {
        pointerEvents: 'inherit',
        cursor: 'auto',
        userSelect: 'text',
        color: theme.palette.action.active,
    },
}))

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
        <HideableTooltip title="Disciplina Especial" hide={!special} describeChild>
            <DisciplineButton
                color="primary"
                variant="contained"
                className={partial ? withMarker : undefined}
                to={special ? undefined : disciplineURL(code)}
                disabled={special}
            >
                { code }
            </DisciplineButton>
        </HideableTooltip>
    )
}

interface HideableTooltipProps extends TooltipProps {
    hide?: boolean
}

/** {@link Tooltip} com opção de não ser renderizada. */
function HideableTooltip({ hide, ...props }: HideableTooltipProps) {
    if (hide) {
        return props.children
    } else {
        return <Tooltip {...props} />
    }
}
