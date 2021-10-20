import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'

import { InvalidResponseError } from 'utils/fetching'

/** Opções do carregador de dados da API. */
export interface ApiLoaderProps<Identifier, Content> {
    /**
     * Item a ser acessado na API, a requisição só é refeita quando esse valor é atualizado.
     * Qualquer mudança nos outros atributos é ignorada.
     */
    item: Identifier,
    /** Recupera e parseia o item da API. */
    fetch: (item: Identifier) => Promise<Content>
    /**
     * Desenha um componente com ou sem o dado já processado.
     *
     * `undefined` representa estado de loading.
     */
    render: (data?: Content) => JSX.Element
    /** Redireciona para "/404" em caso de dado não achado. */
    redirect404?: boolean
    /** Desenha um elemento ou executa uma ação em caso de erro. */
    onError?: (error: any) => JSX.Element | null | void | undefined
}

/**
 *  Componente que faz uma requisição da API, parseia o JSON resultante em um dado objeto e monta
 * um componente com o resultado. A requisição é refeita toda vez que
 * {@linkcode ApiLoaderProps.item props.item} é atualizado, mas ignora mudança em outros atributos.
 *
 * Existem opções para desenhar um componente enquanto o dado é carregado, para redirecionar em
 * caso de 404, e para tratar erros. Respostas com status diferente de `200 OK` são consideradas
 * como erro (veja {@link InvalidResponseError}).
 */
export default function ApiLoader<Ident, Content>(props: ApiLoaderProps<Ident, Content>) {
    const { item, fetch, render, onError, redirect404 } = props
    // o ApiLoader sempre resolve para um outro elemento, e é
    // basicamente esse valor que é alterado ao longo da requisição
    const [element, setElement] = useState<JSX.Element | null>(null)

    // recarrega apenas quando `item` muda
    useEffect(() => {
        // inicializa em estado de loading
        setElement(render())

        // dai monta a URL
        // e faz a requisição
        fetch(item).then(
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
 *  Teste se `item` representa uma {@link InvalidResponseError} com status `404`.
 */
function is404(item: any) {
    return (item instanceof InvalidResponseError)
        && (item.status === 404)
}
