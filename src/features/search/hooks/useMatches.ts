import { useState, useMemo, useEffect } from 'react'

import { Matches } from '../types/content'
import { RequestThrottler } from '../utils/RequestThrottler'

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

/** Função que não faz nada, usada como padrão das callbacks. */
function doNothing() { }

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
}: Config = {}): [Matches, Search] {
    // resultados e limitador compartilham o mesmo estado
    const [{ matches: current, throttler }, setMatches] = useState(() => ({
        matches: Matches.empty(),
        // as configurações são usada apenas no setup
        throttler: new RequestThrottler(Matches.fetch),
    }))

    // de forma memoizada (muda apenas com 'setMatches')
    const search = useMemo(() => {
        // passa os resultados para o atualizador de estados
        throttler.onOutput = (matches) => {
            // sem mudar o limitador
            setMatches({ matches, throttler })
        }
        // e monta função de busca
        return (query: string) => throttler.next(query)
    }, [setMatches])

    // atualiza todas as callbacks quando uma delas mudar
    useEffect(() => {
        throttler.setLoading = setLoading
        throttler.onFull = onFull
        throttler.onError = onError
    }, [onError, onFull, setLoading])

    return [current, search]
}
