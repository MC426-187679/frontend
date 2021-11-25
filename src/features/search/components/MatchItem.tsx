import React, { HTMLAttributes, SyntheticEvent } from 'react'
import { css } from '@emotion/css'
import autosuggestParse from 'autosuggest-highlight/parse'
import Fuse from 'fuse.js'

import { Space } from 'utils/string'
import type { MatchedContent } from '../types/content'

/** Remove estilização de elemento de anchor (`<a>`). */
const anchotWithoutStyling = css`
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
        <a
            className={anchotWithoutStyling}
            href={option.url}
            key={option.identifier}
            onClick={preventDefault}
        >
            <li {...params}>
                <HighlightedText query={inputValue}>
                    { option.description }
                </HighlightedText>
            </li>
        </a>
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
        const matches = autosuggestMatch(fullText, query)
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

/** Opções para a instância do {@link Fuse}. */
const fuseOptions: Fuse.IFuseOptions<string> = {
    isCaseSensitive: false,
    findAllMatches: true,
    ignoreFieldNorm: false,
    ignoreLocation: true,
    includeMatches: true,
    includeScore: false,
    minMatchCharLength: 3,
    shouldSort: false,
    useExtendedSearch: false,
    threshold: 0.5,
}

/** Faz busca com {@link Fuse}, mas adapta resultados para {@link autosuggestParse}. */
function autosuggestMatch(fullText: string, query: string) {
    const fuse = new Fuse([fullText], fuseOptions)
    const results = fuse.search(query)[0]?.matches ?? []
    const matches = results[0]?.indices ?? []
    // os índices do Fuse são inclusivos no final
    return matches.map(([start, end]) => [start, end + 1] as [number, number])
}
