/* eslint-disable import/no-extraneous-dependencies */
import { createTheme, Theme, ThemeOptions } from '@mui/material'
import mediaQuery from 'css-mediaquery'

import { Themes } from 'config/themes'
import type { ThemeMode } from 'providers/Theme'

/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/length */
export type CSSLengthUnit =
    'cap' | 'ch' | 'em' | 'ex' | 'ic' | 'lh' | 'rem' | 'rlh' |
    'vh' | 'vw' | 'vi' | 'vb' | 'vmin' | 'vmax' |
    'px' | 'cm' | 'mm' | 'Q' | 'in' | 'pc' | 'pt'
/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/length */
export type CSSLength = `${number}${CSSLengthUnit}`
/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/resolution */
export type CSSResolution = `${number}${'dpi' | 'dpcm' | 'dppx' | 'x'}`
/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/ratio */
export type CSSRatio = `${number}/${number}`
/** @see https://developer.mozilla.org/en-US/docs/Web/CSS/integer */
export type CSSInteger = `${bigint}`

/** Valores usado como referência no mock do {@link window.matchMedia}. */
export interface MediaValues {
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-hover */
    'any-hover'?: 'none' | 'hover'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer */
    'any-pointer'?: 'none' | 'coarse' | 'fine'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/aspect-ratio */
    'aspect-ratio'?: CSSRatio
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color */
    'color'?: CSSInteger
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut */
    'color-gamut'?: 'srgb' | 'p3' | 'rec2020'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-index */
    'color-index'?: CSSInteger
    /** @deprecated @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/device-aspect-ratio */
    'device-aspect-ratio'?: CSSRatio
    /** @deprecated @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/device-height */
    'device-height'?: CSSLength
    /** @deprecated @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/device-width */
    'device-width'?: CSSLength
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode */
    'display-mode'?: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors */
    'force-colors'?: 'none' | 'active'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/grid */
    'grid'?: 0 | 1 | '0' | '1'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/height */
    'height'?: CSSLength
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/hover */
    'hover'?: 'none' | 'hover'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/inverted-colors */
    'inverted-colors'?: 'none' | 'inverted'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/monochrome */
    'monochrome'?: CSSInteger
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/orientation */
    'orientation'?: 'portrait' | 'landscape'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/overflow-block */
    'overflow-block'?: 'none' | 'scroll' | 'optional-paged' | 'paged'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/overflow-inline */
    'overflow-inline'?: 'none' | 'scroll'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer */
    'pointer'?: 'none' | 'coarse' | 'fine'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme */
    'prefers-color-scheme'?: 'light' | 'dark'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast */
    'prefers-contrast'?: 'no-preference' | 'more' | 'less'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion */
    'prefers-reduced-motion'?: 'no-preference' | 'reduce'
    /**  @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/resolution */
    'resolution'?: CSSResolution
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/scripting */
    'scripting'?: 'none' | 'initial-only' | 'enabled'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/update-frequency */
    'update'?: 'none' | 'slow' | 'fast'
    /** @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/width */
    width?: CSSLength
    /** @see https://stackoverflow.com/questions/5738492/what-does-scan-mean-in-css-media-queries */
    scan?: 'progressive' | 'interlaced'
}

/** Tipo mocado de {@link @mui/material/useMediaQuery}. */
type UseMediaQuery = jest.MockedFunction<(query: string | ((theme: Theme) => string)) => boolean>

declare global {
    interface Mocks {
        /** Versão mocada do {@link window.matchMedia}. */
        matchMedia?: jest.MockedFunction<typeof matchMedia>
        /** Versão mocada do {@link @mui/material/useMediaQuery} */
        useMediaQuery?: UseMediaQuery
    }
}

/** Baseado em https://github.com/mui-org/material-ui/issues/16073#issuecomment-502359758. */
export function mockMatchMedia(values: MediaValues = {}) {
    window.mocks = window.mocks ?? {}
    window.mocks.matchMedia = window.mocks.matchMedia ?? jest.fn()
    window.matchMedia = window.mocks.matchMedia
    global.matchMedia = window.mocks.matchMedia

    window.mocks.matchMedia.mockName('matchMedia')
    window.mocks.matchMedia.mockImplementation(
        function matchMedia(query: string) {
            return {
                matches: mediaQuery.match(query, values),
                media: query,
                onchange: null,
                addListener: jest.fn(() => {}),
                removeListener: jest.fn(() => {}),
                addEventListener: jest.fn(() => {}),
                removeEventListener: jest.fn(() => {}),
                dispatchEvent: jest.fn(() => true as const),
            }
        },
    )
    return window.mocks.matchMedia
}

type MockedUseMediaQuery = jest.Mocked<typeof import('@mui/material/useMediaQuery')>
const mockedUseMediaQuery = jest.requireMock<MockedUseMediaQuery>('@mui/material/useMediaQuery')
jest.mock('@mui/material/useMediaQuery')

/** Gera tema a partir de opções. */
function asTheme(option: ThemeOptions | ThemeMode) {
    if (typeof option === 'string') {
        return Themes[option]
    } else {
        return createTheme(option)
    }
}

/**
 *  Mock do pacote {@link @mui/material/useMediaQuery}.
 */
export function mockUseMediaQuery(themeOptions: ThemeOptions | ThemeMode = 'dark') {
    window.mocks = window.mocks ?? {}
    window.mocks.useMediaQuery = mockedUseMediaQuery.default as UseMediaQuery

    const theme = asTheme(themeOptions)
    window.mocks.useMediaQuery.mockName('useMediaQuery')
    window.mocks.useMediaQuery.mockImplementation(
        function useMediaQuery(query: string | ((theme: Theme) => string)) {
            if (typeof query === 'function') {
                return window.matchMedia(query(theme)).matches
            } else {
                return window.matchMedia(query).matches
            }
        },
    )
    return window.mocks.useMediaQuery
}

// necesário para o namespace {@link ThemeMode}.
mockMatchMedia({ 'prefers-color-scheme': 'dark' })
