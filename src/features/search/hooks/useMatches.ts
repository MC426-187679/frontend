import { useState, useEffect, useCallback } from 'react'

import { Matches } from '../types/content'
import { RequestThrottler, doNothing } from '../utils/RequestThrottler'

/** Função que coloca query na lista de espera para requisição. */
export type Search = (query: string) => void

/** Opções para {@link useMatches} e para o {@link RequestThrottler}. */
interface Config {
    /** Callback para requisições que resultam em erro. */
    readonly onError?: (error: any) => void
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
    setLoading = doNothing,
}: Config = {}): [matches: Matches, search: Search] {
    const throttler = useThrottler(Matches.searchURL, Matches.parse)
    const [matches, setMatches] = useState(Matches.empty)

    // seta as callbacks fo throttler
    throttler.onOutput = setMatches
    throttler.onError = onError
    throttler.setLoading = setLoading

    const search: Search = useCallback(
        (query) => throttler.next(query),
        [throttler],
    )
    return [matches, search]
}

/**
 * Hook que mantém um {@link RequestThrottler}.
 *
 * @param url URL do web socket.
 * @param fetch função de parseia `T` a partir dos textos.
 * @returns o throttler.
 */
function useThrottler<T>(url: string, parser: (query: string, message: string) => T) {
    const [throttler] = useState(() => new RequestThrottler(url, parser))

    // fechar o socket no final da vida do componente
    useEffect(() => {
        return () => {
            throttler.close()
        }
    }, [throttler])
    return throttler
}
