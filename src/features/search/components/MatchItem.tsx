import React, { HTMLAttributes, SyntheticEvent } from 'react'
import { styled } from '@mui/material'
import autosuggestMatch from 'autosuggest-highlight/match'
import autosuggestParse from 'autosuggest-highlight/parse'

import type { MatchedContent } from '../types/content'

/** Regex que dá match com espaços. */
const singleSpace = /\s/g
/** Espaço em branco que evita quebras de linha. */
const nonBreakingSpace = '\u00A0'

interface HighlightedTextProps {
    children: string
    query: string
}

/** Marca parte do texto em bold dependendo do valor de `query`. */
function HighlightedTextBase({ children: fullText, query }: HighlightedTextProps) {
    const matches = autosuggestMatch(fullText, query, {
        insideWords: true,
        findAllOccurrences: true,
        requireMatchAll: false,
    })
    const parts = autosuggestParse(fullText, matches)

    return (
        <>
            {parts.map(({ text, highlight }, index) => {
                const formatted = text.replaceAll(singleSpace, nonBreakingSpace)

                if (highlight) {
                    return <strong key={index.toString(16)}>{formatted}</strong>
                } else {
                    return formatted
                }
            })}
        </>
    )
}

/** Versão memoizada de {@link HighlightTextBase}. */
const HighlightedText = React.memo(HighlightedTextBase)

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
            href={option.url}
            key={option.identifier}
            onClick={preventDefault}
        >
            <li {...params}>
                <HighlightedText query={inputValue}>
                    { option.description }
                </HighlightedText>
            </li>
        </UnstyledAnchor>
    )
}

/** Evita processamento padrão de um evento HTML. */
function preventDefault(event: SyntheticEvent) {
    event.preventDefault()
}
