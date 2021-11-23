export type MockFetch = jest.Mock<ReturnType<typeof fetch>, Parameters<typeof fetch>>

declare global {
    interface Mocks {
        fetch?: MockFetch
    }
}

const unmockedFetch = fetch

export function changePort(path: string, port: `${bigint}`) {
    try {
        const url = new URL(path)
        url.port = port
        return url.toString()
    } catch {
        return new URL(path, `http://127.0.0.1:${port}`).toString()
    }
}

export function mockFetch(port: `${bigint}` = '8080') {
    const fetchMock = jest.fn(
        function fetch(input: RequestInfo, init?: RequestInit) {
            if (typeof input === 'string') {
                return unmockedFetch(changePort(input, port), init)
            } else {
                const newInput = { ...input, url: changePort(input.url, port) }
                return unmockedFetch(newInput, init)
            }
        },
    )

    global.fetch = fetchMock
    window.fetch = fetchMock
    window.mocks.fetch = fetchMock
    return fetchMock
}
