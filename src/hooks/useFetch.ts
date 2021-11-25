import { useEffect, useState } from 'react'

import { InvalidResponseError, type Fetch } from 'utils/fetching'

/** Estado atual do {@link useApi}. */
export const enum FetchState {
    /** Estado de espera do resultado. */
    Loading,
    /** {@link useApi} resultou com dado. */
    Fetched,
    /** {@link useApi} resultou com erro. */
    Error,
}

/** Resultado atual do {@link useApi}. */
export type FetchContent<Data> = {
    /** Estado de espera do resultado. */
    state: FetchState.Loading
    /** Estado sem nenhum dado. */
    data?: undefined
} | {
    /** {@link useApi} resultou com dado. */
    state: FetchState.Fetched
    /** Dado recuperado por fetch. */
    data: Data
} | {
    /** {@link useFetch} resultou com erro. */
    state: FetchState.Error
    /** Estado sem nenhum dado. */
    data?: undefined
    /** Conteúdo do erro. */
    error: any
    /** Se é um erro HTTP de `404 Not Found`. */
    is404: boolean
}

/* eslint-disable-next-line @typescript-eslint/no-redeclare */
export namespace FetchContent {
    export async function resolve<Data>(promise: PromiseLike<Data>): Promise<FetchContent<Data>> {
        try {
            return {
                state: FetchState.Fetched,
                data: await promise,
            }
        } catch (error: any) {
            return {
                state: FetchState.Error,
                error,
                is404: is404(error),
            }
        }
    }
}

/** {@link FetchContent} com estado de loading. */
const loadingContent = { state: FetchState.Loading } as const

/**
 *  Hook que faz uma requisição da API, parseia o JSON resultante em um dado objeto e monta
 * um componente com o resultado. A requisição é refeita toda vez que {@linkcode item} é
 * atualizado, mas ignora mudança em outros atributos.
 *
 * @param item Identificador do item requisitado. Refaz a requisição quando alterado.
 * @param fetch Função que faz a requisição. Pode ser alterada.
 * @param init Opções de requisição do {@link fetch}.
 */
export function useFetch<Item, Content>(
    item: Item,
    fetch: Fetch<Content, Item>,
    init?: RequestInit,
) {
    // esse valor que é alterado ao longo da requisição
    const [content, setContent] = useState<FetchContent<Content>>(loadingContent)

    // recarrega apenas quando `item` muda
    useEffect(() => {
        // inicializa em estado de loading
        setContent(loadingContent)

        // dai monta a URL e faz a requisição
        FetchContent.resolve(fetch(item, init)).then(setContent)
    }, [item])

    // retorna o elemento escolhido
    return content
}

/**
 *  Teste se `item` representa uma {@link InvalidResponseError} com status `404`.
 */
function is404(item: any) {
    return (item instanceof InvalidResponseError)
        && (item.status === 404)
}
