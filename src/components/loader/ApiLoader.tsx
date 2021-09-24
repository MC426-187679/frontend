import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'

import { Parser } from 'utils/helpers/parsing'

/** Opções do carregador de dados da API. */
export interface ApiLoaderProps<T> {
    /**
     * Item a ser acessado na API, a requisição só é refeita
     * quando esse valor é atualizado. Qualquer mudança nos
     * outros atributos é ignorada.s
     */
    item: string
    /** Diretório da URL */
    dir: string
    /** Desenha um componente com o dado já processado. */
    render: (data: T) => JSX.Element
    /** Parser de JSON para o objeto esperado. */
    parser: Parser<T | Promise<T>>
    /** Componente desenhado enquanto espera a resposta do servidor. */
    onLoading?: () => JSX.Element
    /** Redireciona para "/404" em caso de dado não achado. */
    redirect404?: boolean
    /** Desenha um elemento ou executa uma ação em caso de erro. */
    onError?: (error: any) => JSX.Element | null | void | undefined
}

/**
 *  Componente que faz uma requisição da API, parseia o JSON
 * resultante em um dado objeto e monta um componente com
 * o resultado. A requisição é refeita toda vez que
 * {@linkcode ApiLoaderProps.item props.item} é atualizado,
 * mas ignora mudança em outros atributos.
 *
 * Existem opções para desenhar um componente enquanto o
 * dado é carregado, para redirecionar em caso de 404,
 * e para tratar erros. Respostas com status diferente
 * de `200 OK` são consideradas como erro (veja
 * {@link InvalidResponseError}).
 */
export default function ApiLoader<T>(props: ApiLoaderProps<T>) {
    const { dir, item, render, parser, onError, onLoading, redirect404 } = props
    // o ApiLoader sempre resolve para um outro elemento, e é
    // basicamente esse valor que é alterado ao longo da requisição
    const [element, setElement] = useState<JSX.Element | null>(null)

    // recarrega apenas quando `item` muda
    useEffect(() => {
        // inicializa em estado de loading
        if (onLoading) {
            setElement(onLoading())
        }
        // dai faz a requisição
        loadJson(`/api/${dir}/${item}`, parser).then(
            // se tudo for OK, renderiza o componente
            (data) => {
                setElement(render(data))
            },
            // mas em caso de erro
            (error) => {
                // redireciona 404 Not Found
                if (redirect404 && is404(error)) {
                    // TODO: usar PATH da página (futura) de 404
                    setElement(<Redirect to="/404" />)
                // usa a função de tratar erros
                } else if (onError) {
                    setElement(onError(error) ?? null)
                // ou, no pior dos casos, esconde tudo
                } else {
                    setElement(null)
                }
            },
        )
    }, [item])

    // retorna o elemento escolhido
    return element
}

/**
 * Teste se `item` representa uma {@link Response}
 * (ou {@link InvalidResponseError}) com status
 * `404`.
 */
function is404(item: any) {
    return (item instanceof InvalidResponseError || item instanceof Response)
        && (item.status === 404)
}

/** Resposta de servidor com status diferente de `200 OK`. */
export class InvalidResponseError extends Error {
    /** Conteúdo da resposta. */
    readonly response: Response

    constructor(response: Response) {
        super(`Resposta inesperada do servidor: ${response.status}`)

        this.response = response
    }

    /**
     * Código de statis da resposta.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
     */
    get status() {
        return this.response.status
    }
}

/** Faz requisição na URL, parseia pra JSON e depois para `T` */
async function loadJson<T>(url: string, parse: Parser<T | Promise<T>>) {
    const response = await fetch(url)
    // apenas 200 é OK
    if (response.status !== 200) {
        throw new InvalidResponseError(response)
    }
    return parse(await response.json())
}
