import type { Fetch } from 'utils/fetching'

declare global {
    interface Mocks {
        /** Versão mocada do {@link fetch}. */
        fetch?: jest.MockedFunction<typeof fetch>
        /** Versão mocada do {@link useFetch}. */
        useFetch?: typeof useFetch
    }
}

/** {@link fetch} original, sem mock to jest. */
const unmockedFetch = fetch

/** Muda a porta de uma URL. */
function changePort(path: string, port: `${bigint}`) {
    try {
        const url = new URL(path)
        url.port = port
        return url.toString()
    } catch {
        return new URL(path, `http://127.0.0.1:${port}`).toString()
    }
}

/** Muda a porta antes de fazer a requisição. */
export function mockFetch(port: `${bigint}` = '8080') {
    window.mocks = window.mocks ?? {}
    window.mocks.fetch = window.mocks.fetch ?? jest.fn()
    window.fetch = window.mocks.fetch
    global.fetch = window.mocks.fetch

    window.mocks.fetch.mockImplementation(
        function fetch(input: RequestInfo, init?: RequestInit) {
            if (typeof input === 'string') {
                return unmockedFetch(changePort(input, port), init)
            } else {
                const newInput = { ...input, url: changePort(input.url, port) }
                return unmockedFetch(newInput, init)
            }
        },
    )
    return window.mocks.fetch
}

type MockedUseFetch = jest.Mocked<typeof import('hooks/useFetch')>
const { FetchContent } = jest.requireActual<typeof import('hooks/useFetch')>('hooks/useFetch')
const { useFetch } = jest.requireMock<MockedUseFetch>('hooks/useFetch')
jest.mock('hooks/useFetch')

/** {@link hooks/useFetch} que carrega o conteúdo uma vez e repete requisições seguintes. */
export async function mockUseFetch<Item, Content>(item: Item, fetch: Fetch<Content, Item>) {
    window.mocks = window.mocks ?? {}
    window.mocks.useFetch = useFetch

    const content = await FetchContent.resolve(fetch(item))
    window.mocks.useFetch.mockImplementation(
        /* eslint-disable-next-line @typescript-eslint/no-shadow */
        function useFetch() {
            return content
        },
    )
    return window.mocks.useFetch
}
