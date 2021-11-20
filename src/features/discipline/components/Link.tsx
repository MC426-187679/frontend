import React from 'react'
import { Tooltip, TooltipProps, buttonClasses, styled } from '@mui/material'
import { css } from '@emotion/css'

import RouterButton from 'components/RouterButton'
import { joined } from 'utils/string'

import type { Requirement } from '../types/discipline'
import { disciplineURL } from '../utils/params'

/** {@link RouterButton} com largura fixa e menos efeito quando `disabled={true}`. */
const ButtonWithStyledDisabled = styled(RouterButton)(({ theme }) => ({
    minWidth: '12ex',
    whiteSpace: 'nowrap',

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

export interface DisciplineLinkProps {
    /** Código da disciplina ({@link Requirement.code }). */
    code: Requirement['code'] | string
    /** Se a disciplina existe ({@link Requirement.special }). */
    special?: Requirement['special']
    /** Se o link deve ser decorado como requisito parcial ({@link Requirement.partial }). */
    partial?: Requirement['partial']

    fullWidth?: boolean
    size?: 'small' | 'medium' | 'large'
    className?: string
}

/**
 * Link de uma disciplina desenhado como botão.
 */
export default function DisciplineLink(
    { code, partial, special, className, ...props }: DisciplineLinkProps,
) {
    const title = special ? 'Disciplina Especial' : 'Pré-requisito Parcial'

    const classes = joined(className, partial && withMarker)
    return (
        <HideableTooltip title={title} hide={!special && !partial} describeChild>
            <ButtonWithStyledDisabled
                color="primary"
                variant="contained"
                className={classes}
                to={special ? undefined : disciplineURL(code)}
                disabled={special}
                {...props}
            >
                { code }
            </ButtonWithStyledDisabled>
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
