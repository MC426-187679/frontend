import { useState, useEffect, useCallback } from 'react'

import type { Fetch } from 'utils/fetching'

import { Matches } from '../types/content'
import { RequestThrottler, doNothing } from '../utils/RequestThrottler'

/** Função que coloca query na lista de espera para requisição. */
export type Search = (query: string) => void

/** Opções para {@link useMatches} e para o {@link RequestThrottler}. */
interface Config {
    /** Callback para requisições que resultam em erro. */
    readonly onError?: (error: any) => void
    /** Callback para quando a fila de requisições está cheia. */
    readonly onFull?: () => void
    /** Callback para atualização do estado de loading. */
    readonly setLoading?: (isLoading: boolean) => void
}

/**
 *  Hook que mantém estado dos resultados de busca, com uma função que insere novas
 * opções na lista de espera para requisições ao servidor.
 *
 * @param {Config} config Configurações do limitador de requisições ({@link Config}).
 *
 * @returns Resultados atuais e função para busca de próximos resultados.
 */
export function useMatches({
    onError = doNothing,
    onFull = doNothing,
    setLoading = doNothing,
}: Config = {}): [matches: Matches, search: Search] {
    const [throttler, useSetCallback] = useThrottler(Matches.fetch)
    const [matches, setMatches] = useState(Matches.empty)

    // seta as callbacks fo throttler
    useSetCallback('onOutput', setMatches)
    useSetCallback('onError', onError)
    useSetCallback('onFull', onFull)
    useSetCallback('setLoading', setLoading)

    const search: Search = useCallback(
        (query) => throttler.next(query),
        [throttler],
    )
    return [matches, search]
}

/**
 * Hook que mantém um {@link RequestThrottler} e um subhook para controle de suas callbacks.
 *
 * @param fetch função de requisição de `T` a partir dos textos.
 * @returns par `[throttler, useSetter]` em que `useSetter` pode ser usado para setar a setar uma
 *  das callbacks do `throttler` e resetar ela quando o componente for removido.
 */
function useThrottler<T>(fetch: Fetch<T>) {
    const [throttler] = useState(() => new RequestThrottler(fetch))

    /** Hook que associa `callback` a `key` e desassocia durante a remoção do componente. */
    function useSetter<Key extends Exclude<keyof RequestThrottler<T>, 'next'>>(
        key: Key,
        callback: RequestThrottler<T>[Key],
    ) {
        useEffect(() => {
            throttler[key] = callback
            return () => {
                throttler[key] = doNothing
            }
        }, [callback])
    }
    return [throttler, useSetter] as const
}
