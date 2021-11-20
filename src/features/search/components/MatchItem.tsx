import React, { HTMLAttributes, SyntheticEvent } from 'react'
import { styled } from '@mui/material'
import autosuggestMatch from 'autosuggest-highlight/match'
import autosuggestParse from 'autosuggest-highlight/parse'

import { Space } from 'utils/string'
import type { MatchedContent } from '../types/content'

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

interface HighlightedTextProps {
    /** Texto que da opção, que pode ser modificado. */
    children: string
    /** Texto na caixa de busca, usado para comparação. */
    query: string
}

/** Marca parte do texto em bold dependendo do valor de `query`. */
const HighlightedText = React.memo(
    function HighlightedText({ children: fullText, query }: HighlightedTextProps) {
        const matches = autosuggestMatch(fullText, query, {
            insideWords: true,
            findAllOccurrences: true,
            requireMatchAll: false,
        })
        const parts = autosuggestParse(fullText, matches)

        return (
            <>
                {parts.map(({ text, highlight }, index) => {
                    const formatted = Space.withNonBreaking(text)

                    if (highlight) {
                        return <strong key={index.toString(16)}>{formatted}</strong>
                    } else {
                        return formatted
                    }
                })}
            </>
        )
    },
    // comparação simplificada, muda apenas quando algum dos textos mudar
    (prev, next) => prev.query === next.query && prev.children === next.children,
)
