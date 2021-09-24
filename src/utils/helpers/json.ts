import type { Parser } from './parsing'

/** Resposta de servidor com status diferente de `200 OK`. */
export class InvalidResponseError extends Error {
    /** Conteúdo da resposta. */
    readonly response: Response

    constructor(response: Response) {
        super(`Resposta inesperada do servidor: ${response.status}`)

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

/**
 * Requisita dado da API, parseia como JSON e depois
 * parseia para o tipo `T`. O dado é requisitado em
 * `/api/DIRETORIO/ITEM`.
 *
 * @param dir Diretório da API (`DIRETORIO`).
 * @param item Item a ser recuperado (`ITEM`).
 * @param parser Parser para tipo `T`
 * @returns Promessa com um dado do tipo `T`.
 *
 * @throws {@link InvalidResponseError} - Se a {@link Response}
 *  resultar em status diferente de `200 OK`.
 *
 * @throws Erros de parsing ou erros do {@link fetch}
 *  ou do {@link Response.json}.
 */
export async function loadJson<T>(dir: string, item: string, parser: Parser<T | Promise<T>>) {
    const response = await fetch(`/api/${dir}/${item}`)
    // apenas 200 é OK
    if (response.status !== 200) {
        throw new InvalidResponseError(response)
    }
    const json = await response.json()
    return parser(json)
}
