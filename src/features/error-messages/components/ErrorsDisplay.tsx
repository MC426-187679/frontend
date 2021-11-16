import React, { Reducer, useReducer } from 'react'
import { Stack } from '@mui/material'
import { css } from '@emotion/css'

import type { Message } from '../types/message'
import { useListener } from '../providers/errors'
import ErrorAlert from './ErrorAlert'

/** Classe CSS com largura total. */
const fullWidth = css`
    width: 100%;
`

/** Componente que desenha as messagens de erro do provedor atual em uma pilha. */
export default function ErrorsDisplay() {
    // mapa que armazena mensagens de erro na ordem em que foram passadas
    const [messages, dispatch] = useOrderedMap<string, Message>()
    // listener que insere mensagens no mapa
    useListener(
        (message) => {
            dispatch({ op: 'insert', key: message.kind, value: message })
        },
        [dispatch],
    )

    return (
        <Stack className={fullWidth}>
            {messages.map(({ key, value }) => (
                <ErrorAlert key={key} error={value} dispatch={dispatch} />
            ))}
        </Stack>
    )
}

/** Mapa que mantém ordem de inserção. */
interface OrderedMap<K, V> extends ReadonlyArray<{
    readonly key: K,
    readonly value: V,
}> {}

/** {@link useReducer} com estado e ações de um {@link OrderedMap}. */
function useOrderedMap<K, V>() {
    type R = Reducer<OrderedMap<K, V>, OrderedMap.Action<K, V>>

    return useReducer<R>(OrderedMap.reducer, [])
}

namespace OrderedMap {
    /** Ações válidas em {@link OrderedMap}.  */
    export type Action<K, V> = {
        op: 'insert'
        key: K
        value: V
    } | {
        op: 'remove'
        key: K
    }

    /**
     * Função que aplica uma ação no mapa. Usada com {@link useReducer}.
     *
     * @param map Mapa atual.
     * @param action Ação a ser executada.
     * @returns Novo mapa.
     */
    export function reducer<K, V>(map: OrderedMap<K, V>, action: Action<K, V>) {
        switch (action.op) {
            case 'insert':
                return insert(map, action.key, action.value)
            case 'remove':
                return remove(map, action.key)
            default:
                return map
        }
    }

    /**
     * Remove chave em um mapa não ordenado.
     *
     * @param map Mapa atual.
     * @param key Chave a ser removida.
     * @returns Vetor que representa novo mapa.
     */
    function remove<K, V>(map: OrderedMap<K, V>, key: K) {
        return map.filter((element) => {
            return element.key !== key
        })
    }

    /**
     *  Insere valor e chave no final do mapa não ordenado. Remove valor anteirior se chave
     * já tiver um valor associado.
     *
     * @param map Mapa atual.
     * @param key Chave a ser inserida.
     * @param value Valor a ser inserido.
     * @returns Vetor que representa novo mapa.
     */
    function insert<K, V>(map: OrderedMap<K, V>, key: K, value: V) {
        const newMap = remove(map, key)
        newMap.push({ key, value })
        return newMap
    }
}
