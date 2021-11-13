import { useEffect, useState } from 'react'

import { InvalidResponseError } from 'utils/fetching'

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
} | {
    /** {@link useApi} resultou com dado. */
    state: FetchState.Fetched
    /** Dado recuperado por fetch. */
    data: Data
} | {
    /** {@link useApi} resultou com erro. */
    state: FetchState.Error
    /** Conteúdo do erro. */
    error: any
    /** Se é um erro de 404. */
    is404: boolean
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
 */
export function useApi<Item, Content>(item: Item, fetch: (item: Item) => Promise<Content>) {
    // esse valor que é alterado ao longo da requisição
    const [content, setContent] = useState<FetchContent<Content>>(loadingContent)

    // recarrega apenas quando `item` muda
    useEffect(() => {
        // inicializa em estado de loading
        setContent(loadingContent)

        // dai monta a URL e faz a requisição
        fetch(item).then(
            // caso em que tudo foi OK
            (data) => {
                setContent({
                    state: FetchState.Fetched,
                    data,
                })
            },
            // caso de erro
            (error) => {
                setContent({
                    state: FetchState.Error,
                    error,
                    is404: is404(error),
                })
            },
        )
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
