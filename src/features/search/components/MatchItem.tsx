import React, { HTMLAttributes, SyntheticEvent } from 'react'
import { css } from '@emotion/css'
import autosuggestParse from 'autosuggest-highlight/parse'
import Fuse from 'fuse.js'

import { Space } from 'utils/string'
import type { MatchedContent } from '../types/content'

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
        <li {...params} key={option.identifier}>
            <HighlightedText query={inputValue} href={option.url}>
                { option.description }
            </HighlightedText>
        </li>
    )
}

/** Remove estilização de elemento de anchor (`<a>`). */
const anchorWithoutStyling = css`
    color: inherit;
    text-decoration: none;
    display: block;
    width: 100%;
    height: 100%;
`

interface HighlightedTextProps {
    /** Texto que da opção, que pode ser modificado. */
    children: string
    /** Texto na caixa de busca, usado para comparação. */
    query: string
    /** URL da opção. */
    href?: string
}

/** Marca parte do texto em bold dependendo do valor de `query`. */
const HighlightedText = React.memo(
    function HighlightedText({ children: fullText, query, href }: HighlightedTextProps) {
        const matches = autosuggestMatch(fullText, query)
        const parts = autosuggestParse(fullText, matches)

        return (
            <a
                className={anchorWithoutStyling}
                href={href}
                onClick={preventDefault}
            >
                {parts.map(({ text, highlight }, index) => {
                    const formatted = Space.withNonBreaking(text)

                    if (highlight) {
                        return <strong key={index.toString(16)}>{formatted}</strong>
                    } else {
                        return formatted
                    }
                })}
            </a>
        )
    },
    // comparação simplificada, muda apenas quando algum dos textos mudar
    (prev, next) => prev.query === next.query && prev.children === next.children,
)

/** Evita processamento padrão de um evento HTML. */
function preventDefault(event: SyntheticEvent) {
    event.preventDefault()
}

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
    // evita problemas de texto repetido
    const ranges = [] as Array<[number, number]>
    matches.forEach(([start, end]) => {
        const hasOverlap = ranges.some((range) => overlaps([start, end + 1], range))
        if (!hasOverlap) {
            // os índices do Fuse são inclusivos no final
            ranges.push([start, end + 1])
        }
    })
    return ranges
}

/** Diz se `rangeA` e `rangeB` têm algum ponto em comum. */
function overlaps(rangeA: [number, number], rangeB: [number, number]) {
    return !(rangeA[0] >= rangeB[1] || rangeA[1] <= rangeB[0])
}
