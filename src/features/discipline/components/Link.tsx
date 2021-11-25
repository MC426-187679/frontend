import React from 'react'
import { buttonClasses, styled } from '@mui/material'
import { css } from '@emotion/css'

import RouterButton, { type RouterButtonProps } from 'components/RouterButton'
import { joined } from 'utils/string'

import type { Requirement } from '../types/discipline'
import { Discipline } from '../types/discipline'

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

type OverridedProps = 'color' | 'variant' | 'to' | 'disabled' | 'title'

export interface DisciplineLinkProps extends Omit<RouterButtonProps, OverridedProps> {
    /** Código da disciplina ({@link Requirement.code }). */
    code: Requirement['code'] | string
    /** Se a disciplina existe ({@link Requirement.special }). */
    special?: Requirement['special']
    /** Se o link deve ser decorado como requisito parcial ({@link Requirement.partial }). */
    partial?: Requirement['partial']
}

/**
 * Link de uma disciplina desenhado como botão.
 */
export default React.memo(
    function DisciplineLink(
        { code, partial, special, className, ...props }: DisciplineLinkProps,
    ) {
        let title: string | undefined
        if (special) {
            title = 'Disciplina Especial'
        } else if (partial) {
            title = 'Pré-requisito Parcial'
        }

        return (
            <ButtonWithStyledDisabled
                color="primary"
                variant="contained"
                className={joined(className, partial && withMarker)}
                to={special ? undefined : Discipline.pagePath(code)}
                disabled={special}
                title={title}
                {...props}
            >
                { code }
            </ButtonWithStyledDisabled>
        )
    },
    // só atualiza se alguma prop mudar
    (prev, next) => {
        const keys = ['code', 'special', 'partial', 'fullWidth', 'className', 'size'] as const
        return prev === next || keys.every((key) => prev[key] === next[key])
    },
)
