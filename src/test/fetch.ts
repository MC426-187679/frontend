import type { And, Extends, Or, Resolve } from 'types/basic'
import type { IsIntString, IsTextSeparatedBy, IsPathname } from 'types/string'

import { splitJoin } from 'utils/string'

/**
 * Se `Text` é um endereço IPv4, composto de 4 seções de inteiros positivos.
 *
 * Obs: O range não é checado.
 */
type IsIPv4Address<Text extends string>
    = Text extends `${infer A}.${infer B}.${infer C}.${infer D}`
        ? And<IsIntString<A>, IsIntString<B>, IsIntString<C>, IsIntString<D>>
        : false

/** Se `Text` é um domain name para usos em URL, composto de caracteres separados por `'.'`. */
type IsDomainName<Text extends string> = IsTextSeparatedBy<'.', Text>
/**
 * Se `Text` é um {@link URL.hostname}, que pode ser 'localhost', um IPv4 ou
 * {@link IsDomainName}.
 */
type IsHostname<Text extends string>
    = Or<Extends<Text, 'localhost'>, IsIPv4Address<Text>, IsDomainName<Text>>

/**
 * Se `Text` é um {@link URL.host}, composto de {@link IsHostname} e opcionalmente uma
 * porta para comunicação (inteiro positivo).
 */
type IsHost<Text extends string>
    = Text extends `${infer Domain}:${infer Port}`
        ? And<IsHostname<Domain>, IsIntString<Port>>
        : IsHostname<Text>

/** Se `Text` é uma {@link URL} válida, considerando os casos de uso aqui. */
type IsUrl<Text extends string, Protocol extends string>
    = Text extends `${Protocol}://${infer Rest}`
        ? Rest extends `${infer Host}/${infer Path}`
            ? And<IsHost<Host>, IsPathname<Path>>
            : IsHost<Rest>
        : false

/** Trata `Text` como entrada válida para {@link URL}, ou `never`. */
type Url<Text extends string, Protocol extends string = 'http' | 'https'>
    = Resolve<IsUrl<Text, Protocol>, Text, never>

/** Muda a URL base de `path` para `to` se a requisição é do tipo `same-origin`. */
function changeIfSameOrigin(path: string, to: URL) {
    try {
        return new URL(path).href
    } catch {
        const url = new URL(path, to)
        url.pathname = splitJoin(to.pathname, url.pathname)
        return url.href
    }
}

/** {@link fetch} original, sem mock to jest. */
export const unmockedFetch = fetch

declare global {
    interface Mocks {
        /** Versão mocada do {@link fetch}. */
        fetch?: jest.MockedFunction<typeof fetch>
    }
}

/** Redireciona as requisições do tipo 'same-origin' para `newOrigin`. */
export function mockFetch<Origin extends string>(newOrigin: Url<Origin>) {
    window.mocks = window.mocks ?? {}
    window.mocks.fetch = window.mocks.fetch ?? jest.fn()
    window.fetch = window.mocks.fetch
    global.fetch = window.mocks.fetch

    const origin = new URL(newOrigin)
    window.mocks.fetch.mockImplementation(
        function fetch(input: RequestInfo, init?: RequestInit) {
            if (typeof input === 'string') {
                return unmockedFetch(changeIfSameOrigin(input, origin), init)
            } else {
                const newInput = { ...input, url: changeIfSameOrigin(input.url, origin) }
                return unmockedFetch(newInput, init)
            }
        },
    )
    return window.mocks.fetch
}

beforeEach(() => {
    // redireciona para a porta padrão do Vapor
    mockFetch('http://localhost:8080/')
})
