import { useEffect } from 'react'

import { Message } from '../types/message'
import { useErrors } from '../providers/errors'

interface SendErrorProps extends Omit<Message, 'message'> {
    /** O mesmo que {@link Message.message}. */
    children: string | string[],
}

/** Componente que envia mensagem de mensagens de erro, sem renderizar nada. */
export default function SendError({ children, ...rest }: SendErrorProps) {
    const send = useErrors()
    // atrasa o envio da mensagem, por problema com tempo de renderização do react
    useEffect(() => {
        send({ message: join(children), ...rest })
    }, [])

    return null
}

/** Junta várias string em uma, se necessário. */
function join(text: string | string[], separator = ' ') {
    if (typeof text === 'string') {
        return text
    } else {
        return text.join(separator)
    }
}
