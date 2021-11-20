import { DependencyList, Dispatch, Reducer, SetStateAction, useEffect, useReducer } from 'react'

/** Opções do {@link EventListener} em {@link useEventListener}. */
export interface EventListenerOptions<Type extends keyof WindowEventMap>
    extends AddEventListenerOptions {
    /** Especificador do tipo de evento. */
    type: Type
}

/**
 * Hook que insere um cuidador de evento e trata de sua remoção ao final da vida do componente.
 *
 * @param options Tipo do listener e outras opções adicionais.
 * @param listener Função que trata do evento.
 * @param deps Lista de dependências para reassociação do listener. (padrão: `[listener]`).
 */
export function useEventListener<Type extends keyof WindowEventMap>(
    options: EventListenerOptions<Type>,
    listener: (this: Window, event: WindowEventMap[Type]) => void,
    deps: DependencyList = [listener],
) {
    useEffect(() => {
        window.addEventListener(options.type, listener, options)
        return () => {
            window.removeEventListener(options.type, listener, options)
        }
    }, deps)
}

/** Par chave e valor relacionados no {@link localStorage}, mantido com {@link StorageKey.use}. */
interface StorageKey<Value extends string> {
    /** Chave de acesso no {@link localStorage.getItem}. */
    readonly key: string
    /**
     *  Valor atual atual no estado do React, que deve ser mantido atualizado com o
     * {@link localStorage}.
     */
    readonly value: Value
    /** Função que checa se a string do {@link localStorage} tem o subtipo correto. */
    readonly isValue: (item: string) => item is Value
}

namespace StorageKey {
    /** Valor ou função de inicialização. */
    type Initializer<T> = (T | (() => T))
    /** Função de checagem de subtipo. */
    type Checker<T extends string> = (item: string) => item is T

    /** Resolve um valor ou função de inicialização. */
    function init<T extends string>(initializer: Initializer<T>) {
        if (typeof initializer === 'function') {
            return initializer()
        } else {
            return initializer
        }
    }

    /** Inicializa {@link StorageKey} para uso em {@link use}. */
    function initialize<Value extends string>(
        initialKey: Initializer<string>,
        initialValue: Initializer<Value>,
        isValue: Checker<Value>,
    ): StorageKey<Value> {
        const key = init(initialKey)

        const storageValue = localStorage.getItem(key)
        // se 'localStorage' já tem uma chave válida, retorna ela
        if (storageValue !== null && isValue(storageValue)) {
            return { key, value: storageValue, isValue }
        // senão, usa o parâmetro de inicialização e atualiza 'localStorage'
        } else {
            const localValue = init(initialValue)
            localStorage.setItem(key, localValue)
            return { key, value: localValue, isValue }
        }
    }

    /**
     * Ações usadas no {@link reducer}, que podem aparecer de duas formas:
     *
     * - Um valor do mesmo subtipo que o usado na função principal ou função de transformação
     *  a partir do estado atual. Esse argumento segue o mesmo padrão do resultado de
     *  {@link React.useState} é a interface exportada no {@link useStorage}.
     *
     * - Um valor recebido diretamente do {@link localStorage}, que pode não seguir o subtipo
     *  esperado. Essa ação é para uso interno da {@link useStorage}.
     */
    type Action<Value extends string> = SetStateAction<Value> | {
        /** Valor retornado pelo {@link localStorage.getItem}. */
        storageValue: string | null
    }

    /** Próximo do valor do {@link reducer}, considerando a ação recebida e o estado atual. */
    function nextValue<Value extends string>(
        { value, isValue }: StorageKey<Value>,
        action: Action<Value>,
    ) {
        // se a ação for apenas um valor ou um adaptador de valor, aplica ela
        if (typeof action === 'string') {
            return action
        } else if (typeof action === 'function') {
            return action(value)
        } else {
            const { storageValue } = action
            // se for uma valor retirado do {@link localStorage}, ele deve ser correto
            if (storageValue !== null && isValue(storageValue)) {
                return storageValue
            // senão retorna apenas o estado anterior
            } else {
                return value
            }
        }
    }

    /**
     *  Função de tratamento do {@link StorageKey} com {@link useReducer}, responsável por manter
     * o estado do objeto tanto no React quanto no {@link localStorage}.
     *
     * @param state Estado atual do {@link StorageKey}.
     * @param action Ação para produção de novo estado.
     * @returns Novo estado, se for necessária a modificação, ou o estado anterior.
     */
    function reducer<Value extends string>(state: StorageKey<Value>, action: Action<Value>) {
        const newValue = nextValue(state, action)

        if (localStorage.getItem(state.key) !== newValue) {
            localStorage.setItem(state.key, newValue)
        }
        // atualiza o estado apenas se necessário
        if (state.value !== newValue) {
            return { ...state, value: newValue }
        } else {
            return state
        }
    }

    /** {@link useReducer} usando o {@link reducer} e o {@link initialize}. */
    export function use<Value extends string>(
        initialKey: Initializer<string>,
        initialValue: Initializer<Value>,
        isValue: Checker<Value>,
    ) {
        type R = Reducer<StorageKey<Value>, Action<Value>>

        return useReducer<R, any>(reducer, undefined, () => {
            return initialize(initialKey, initialValue, isValue)
        })
    }
}

/**
 * Hook para armazenamento de um estado usando {@link localStorage}. É inserido também um lsitener
 * a chave usando que atualiza o valor caso outra janela mude o estado.
 *
 * @param initialKey Chave usada para armazenamento no {@link localStorage}. A chave deve ser
 *  única em toda a aplicação. Usada apenas na inicialização e repetida nas seguintes chamadas.
 * @param initialValue Valor usado na inicialização do estado, caso {@link localStorage} não tenha
 *  nenhum valor associado à chave. Também pode ser uma função de inicialização.
 * @param isValue Função que checa se o valor da chave em {@link localStorage} é válido como
 *  {@link Value}.
 * @returns Par `[estado, mudaEstado]`, como em {@link React.useState}.
 */
export function useStorage<Value extends string>(
    initialKey: string | (() => string),
    initialValue: Value | (() => Value),
    isValue: (item: string) => item is Value,
): [Value, Dispatch<SetStateAction<Value>>] {
    // monta reducer com chave e valor inicial
    const [{ key, value }, dispatch] = StorageKey.use(initialKey, initialValue, isValue)

    // checagem síncrona se o valor está atualizado
    const storageValue = localStorage.getItem(key)
    if (value !== storageValue) {
        dispatch({ storageValue })
    }

    // adiciona um listener para mudanças em outras janelas
    useEventListener(
        { type: 'storage', capture: false, once: false, passive: true },
        // listener em storage
        ({ key: eventKey, oldValue, newValue, storageArea }) => {
            if (storageArea === localStorage
                && eventKey === key
                && oldValue !== newValue
            ) {
                dispatch({ storageValue: newValue })
            }
        },
        [dispatch],
    )

    return [value, dispatch]
}
