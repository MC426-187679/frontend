import React, { Dispatch, useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Collapse } from '@mui/material'

import type { Message } from '../types/message'
import { Timeout, toMillis } from '../types/timeout'

interface ErrorAlertProps {
    /** Mensagem de erro. */
    error: Message
    /** Operação de auto-remoção da alerta. */
    dispatch: Dispatch<{ op: 'remove', key: string }>
}

/** Componente que desenha a mensage de erro no formato de alerta. */
export default function ErrorAlert({ error, dispatch }: ErrorAlertProps) {
    // Collapse só deve ser aberto após primeira inicialização
    const initialized = useInitialized()
    const { isOpen, open, close } = useOpen(true)

    // quando o Collapse fechar, remove mensagem do mapa
    const remove = useCallback(
        () => dispatch({ op: 'remove', key: error.kind }),
        [dispatch],
    )

    // inicia fechamento do Collapse após o timeout
    useTimeout(error.timeout, () => close(), [error])
    // se a mensagem de erro for alterada, abre o Collapse novamente
    useEffect(() => open(), [error])
    return (
        <Collapse in={initialized && isOpen} onExited={remove} unmountOnExit>
            <Alert
                variant="outlined"
                severity={error.severe ? 'error' : 'warning'}
                onClose={close}
                closeText="Fechar"
            >
                { error.message }
            </Alert>
        </Collapse>
    )
}

/**
 * Retorna `false` na primeira execução do componente e `true` nas demais.
 */
function useInitialized() {
    const [initialized, setInitilized] = useState(false)

    useEffect(() => {
        if (!initialized) {
            setInitilized(true)
        }
    }, [initialized, setInitilized])

    return initialized
}

/**
 * Hook com estado booleano, com a operação de `open` (muda para `true`) e `close` (para `false`).
 */
function useOpen(initialState = true) {
    const [isOpen, setOpen] = useState(initialState)

    const operations = useMemo(() => ({
        open: () => { setOpen(true) },
        close: () => { setOpen(false) },
    }), [setOpen])

    return { isOpen, ...operations }
}

/**
 * Executa callback depois do tempo especificado em `timeout`.
 *
 * @param timeout Tempo de espera para a execução. Se `undefined`, a função não é executada.
 * @param callback Função que deverá ser executada. Só é considerada a última versão recebida
 *  dela antes do tempo encerrar.
 * @param deps Dependências para quando o {@linkcode setTimeout} deve ser reiniciado.
 *  (padrão: `[timeout]`).
 */
function useTimeout(
    timeout: Timeout | undefined,
    callback: () => void,
    deps: React.DependencyList = [timeout],
) {
    // estado fixo, para que a última callback recebida seja usada, em vez da primeira
    const [config] = useState({ finish: callback })
    config.finish = callback

    useEffect(() => {
        if (!timeout) {
            return undefined
        }

        // inicia timeout e retorna callback para cancelamento
        const handle = setTimeout(() => config.finish(), toMillis(timeout))
        return () => clearTimeout(handle)
    }, deps)
}
