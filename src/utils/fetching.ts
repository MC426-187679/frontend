/** Resposta de servidor com status diferente de `200 OK`. */
export class InvalidResponseError extends Error {
    /** Conteúdo da resposta. */
    readonly response: Response

    constructor(response: Response) {
        super(`Resposta inesperada do servidor: ${response.status}`)

        this.name = 'InvalidResponseError'
        this.response = response
    }

    /**
     * Código de status da resposta.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
     */
    get status() {
        return this.response.status
    }
}

/** Opções padrões para {@link fetch}. */
const defaultOptions: RequestInit = {
    mode: 'same-origin',
    credentials: 'same-origin',
    referrerPolicy: 'same-origin',
    keepalive: false,
}

/**
 * Requisita dado da API e parseia como JSON.
 *
 * @param url URL da requisição.
 * @param init Configurações da requisição.
 * @returns Promessa com o JSON.
 *
 * @throws {@link InvalidResponseError} - Se a {@link Response} resultar em status diferente
 *  de `200 OK`.
 *
 * @throws Erros do {@link fetch} ou do {@link Response.json}.
 */
export async function fetchJson(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init ?? defaultOptions)
    // apenas 200 é OK
    if (response.status !== 200) {
        throw new InvalidResponseError(response)
    }
    return response.json()
}
