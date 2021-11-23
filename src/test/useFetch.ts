import type { Fetch } from 'utils/fetching'

export type MockedUseFetch = jest.Mocked<typeof import('hooks/useFetch')>
const { FetchContent } = jest.requireActual<typeof import('hooks/useFetch')>('hooks/useFetch')
const { useFetch } = jest.requireMock<MockedUseFetch>('hooks/useFetch')
jest.mock('hooks/useFetch')

export async function mockUseFetch<Item, Content>(item: Item, fetch: Fetch<Content, Item>) {
    const content = await FetchContent.resolve(fetch(item))

    useFetch.mockImplementation(() => content)
}
