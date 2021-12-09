import React, { type SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { css } from '@emotion/css'

import { type Course, Tree } from '../types/course'
import { Parsing } from '../utils/parsing'

const withMargin = css`
    margin-top: 1.5ex;
`

export interface VariantSelectProps {
    options: readonly Course.Variant[]
    code: Course.Code
}

export function VariantSelect({ options, code: course }: VariantSelectProps) {
    const [variant, setVariant] = useState(options[0]?.code ?? 'arvore')
    useVariantRedirect(course, variant)

    const changeIndex = useCallback(
        function changeIndex(event: SelectChangeEvent<unknown>) {
            const { value } = event?.target ?? {}

            if (Parsing.isVariantCode(value)) {
                setVariant(value)
            }
        },
        [setVariant],
    )

    if (options.length <= 0) {
        return null
    }

    return (
        <FormControl fullWidth className={withMargin}>
            <InputLabel id="variant-selector-input">Modalidade</InputLabel>
            <Select
                labelId="variant-selector-input"
                id="variant-selector"
                value={variant}
                label="Modalidade"
                onChange={changeIndex}
            >
                {options.map(({ code, name }) => (
                    <MenuItem value={code} key={code}>
                        <UnstyledAnchor href={Tree.pagePath(course, variant)}>
                            { code } - { name }
                        </UnstyledAnchor>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

function useVariantRedirect(course: Course.Code, variant: Tree.VariantCode) {
    const url = Tree.pagePath(course, variant)

    const navigate = useNavigate()
    const match = useMatch(Tree.pagePath(course, '*'))

    useEffect(() => {
        if (match && match.pathname !== url) {
            navigate(url)
        }
    }, [match])
}

const anchorWithoutStyling = css`
    color: inherit;
    text-decoration: none;
    display: block;
    width: 100%;
    height: 100%;
`

function UnstyledAnchor({ href, children }: { href: string, children: string[] }) {
    return (
        <a
            href={href}
            className={anchorWithoutStyling}
            onClick={preventDefault}
        >
            { children }
        </a>
    )
}

/** Evita processamento padrão de um evento HTML. */
function preventDefault(event: SyntheticEvent) {
    event.preventDefault()
}
