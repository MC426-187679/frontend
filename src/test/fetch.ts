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
export function mockFetch(newOrigin: string) {
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
