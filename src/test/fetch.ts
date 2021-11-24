/** Primeiro dígito de um número positivo. */
type LeadingDigit = `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
/** Um dígito qualquer. */
type Digit = '0' | LeadingDigit
/** Caracteres ascii minúsculos. */
type LowercaseAscii
    = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
    | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

/** Se `T` é um subtipo de `U`. */
type Extends<T, U, True = true, False = false> = T extends U ? True : False
/** Resolve para `True` se `Predicate` pode ser garantido como `true`. */
type Resolve<Predicate extends boolean, True = true, False = false>
    = Extends<true, Predicate, True, False>
/** Resolve para `false` se `Predicate` é `true`. */
type Not<Predicate extends boolean> = Resolve<Predicate, false, true>
/** Resolve uma conjunção de até 4 subtipos booleanos. */
type And<A extends boolean, B extends boolean, C extends boolean = true, D extends boolean = true>
    = Resolve<Resolve<A, B>, Resolve<C, D>, false>
/** Resolve uma disjunção de até 4 subtipos booleanos. */
type Or<A extends boolean, B extends boolean, C extends boolean = false, D extends boolean = false>
    = Not<And<Not<A>, Not<B>, Not<C>, Not<D>>>

/**
 * Retorna se `Text` é uma repetição de 1 ou mais vezes de `Char`. Se `Emptiable` é `true`,
 * também valida repetições de 0 vezes, isto é, a string vazia.
 */
type Repeats<Char extends string, Text extends string, Emptiable extends boolean = false>
    = Text extends `${Char}${infer Rest}`
        ? Repeats<Char, Rest, true>
        : Extends<Text, '', Emptiable>
/**
 * Se `Text` é a representação em string de um número positivo, ou seja, uma
 * composição de {@link Digit}s sem sinal e sem zeros à esquerda.
 */
type IsIntString<Text extends string>
    = Text extends `${LeadingDigit}${infer Rest}`
        ? Repeats<Digit, Rest, true>
        : Repeats<Digit, Text>
/** Se `Text` é composto apenas de {@link LowercaseAscii}. */
type IsAsciiLowercase<Text extends string> = Repeats<LowercaseAscii, Text>
/**
 *  Retorna se `Text` é composto de substrings não-vazias separadas por 1 ou mais `Char`s. Se
 * `Emptiable` é `true`, também valida repetições de 0 vezes, isto é, apenas
 * {@link IsAsciiLowercase}.
 */
type IsTextSeparatedBy<Char extends string, Text extends string, Empty extends boolean = true>
    = Text extends `${infer Start}${Char}${infer Rest}`
        ? And<IsAsciiLowercase<Start>, IsTextSeparatedBy<Char, Rest, false>>
        : And<IsAsciiLowercase<Text>, Not<Empty>>

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
/** Se `Text` é um {@link URL.pathname}, composto de palavras separadas por `'/'`. */
type IsPathname<Text extends string> = IsTextSeparatedBy<'/', Text, false>
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
        url.pathname = `${to.pathname}${url.pathname}`
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
    mockFetch('http://localhost:8080')
})
