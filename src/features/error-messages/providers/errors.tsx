import React, { Dispatch, useContext, useEffect, useState } from 'react'
import type { Consumer, Message, Relay } from '../types/message'

/** {@link Relay} simples que repassa as mensagens para subconsumidores. */
function empty(): Relay {
    // subconsumidores
    const consumers = new Set<Consumer>()

    return {
        // insere novo subconsumidor
        add: (consumer) => {
            consumers.add(consumer)
            return () => consumers.delete(consumer)
        },
        // recebe e repassa mensagens de erro
        receive: (message) => {
            consumers.forEach((consumer) => {
                consumer.receive(message)
            })
        },
    }
}

/** Contexto das mensagens de erro. */
const ErrorsContext = React.createContext(empty())

/**
 * Adiciona consumidor para mensagens de erro.
 *
 * @param consumer Função ou objeto que consome mensagens de erro.
 * @param deps Lista de dependências para atualizar o consumidor. (padrão: `[consumer]`)
 */
export function useListener(
    consumer: Consumer | Consumer['receive'],
    deps: React.DependencyList = [consumer],
) {
    const relay = useContext(ErrorsContext)

    useEffect(
        // adiciona listener e retorna callback para remoção do listener
        () => {
            if (typeof consumer === 'function') {
                return relay.add({ receive: consumer })
            } else {
                return relay.add(consumer)
            }
        },
        [relay, ...deps],
    )
}

/** Retorna função que envia mensagens de erro pro contexto atual. */
export function useErrors(): Dispatch<Message> {
    const relay = useContext(ErrorsContext)
    return relay.receive
}

function doNothing() {}

interface ErrorsProviderProps {
    /** Passar erros do provedor pai para esse novo. */
    subscribeToParent?: boolean
    /** Demais componentes. */
    children?: React.ReactNode
}

/** Abre um novo recebedor de mensagens. */
export function ErrorsProvider({ subscribeToParent, children }: ErrorsProviderProps) {
    const [relay] = useState(empty)

    useListener(subscribeToParent ? relay : doNothing)
    return (
        <ErrorsContext.Provider value={relay}>
            { children }
        </ErrorsContext.Provider>
    )
}
