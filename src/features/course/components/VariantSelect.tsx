import React, { type SyntheticEvent, useCallback, useEffect, useState } from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import { css } from '@emotion/css'

import type { Course } from '../types/course'
import { COURSE_PAGE_PATH, variantUrl } from '../utils/params'

const withMargin = css`
    margin-top: 1.5ex;
`

export interface VariantSelectProps {
    options: readonly Course.Variant[]
    code: string
}

export function VariantSelect({ options, code: courseCode }: VariantSelectProps) {
    const [index, setIndex] = useState(0)
    useVariantIndex(courseCode, index)

    if (options.length <= 0) {
        return null
    }

    const changeIndex = useCallback(
        function changeIndex(event: SelectChangeEvent<unknown>) {
            const { value } = event?.target ?? {}

            if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
                setIndex(value)
            }
        },
        [setIndex],
    )

    return (
        <FormControl fullWidth className={withMargin}>
            <InputLabel id="variant-selector-input">Modalidade</InputLabel>
            <Select
                labelId="variant-selector-input"
                id="variant-selector"
                value={index}
                label="Modalidade"
                onChange={changeIndex}
            >
                {options.map(({ code, name }, idx) => (
                    <MenuItem value={idx} key={code}>
                        <UnstyledAnchor href={variantUrl(courseCode, idx)}>
                            { code } - { name }
                        </UnstyledAnchor>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}

function useVariantIndex(code: string, index: number) {
    const url = variantUrl(code, index)

    const navigate = useNavigate()
    const match = useMatch(`${COURSE_PAGE_PATH}/*`)

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
