import React, { HTMLAttributes, SyntheticEvent } from 'react'
import { styled } from '@mui/material'

import { MatchedContent } from './matches'

/** Elemento de anchor (`<a></a>`) sem estilização. */
const UnstyledAnchor = styled('a')`
    color: inherit;
    text-decoration: none;
    & li {
        color: revert;
        text-decoration: revert;
    }
`

interface MatchItemProps extends HTMLAttributes<HTMLLIElement> {
    option: MatchedContent
    inputValue: string
    selected: boolean
}

/**
 * Representação de um {@link MatchedContent} com efeito de link para uso com `Autocomplete`.
 */
export default function MatchItem(props: MatchItemProps) {
    const { option, inputValue, selected, ...params } = props

    return (
        <UnstyledAnchor
            href={option.asUrl}
            key={option.identifier}
            onClick={preventDefault}
        >
            <li {...params}>
                { option.description }
            </li>
        </UnstyledAnchor>
    )
}

/** Evita processamento padrão de um evento HTML. */
function preventDefault(event: SyntheticEvent) {
    event.preventDefault()
    event.stopPropagation()
}
