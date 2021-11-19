/** Função que parseia um objeto qualquer como tipo `Content`. */
export interface Parser<Content> {
    (item: any, options?: Parser.Options<Content>): Content
}

export namespace Parser {
    /**
     * Opções para os Parsers de JSON.
     *
     * Os valores padrões podem ser vistos em {@link defaultOptions}.
     */
    export type Options<Content> = {
        /** Ignora erros de parsing. */
        readonly required?: false
        /** Usa esse valor em vez de acusar erro. */
        readonly defaultsTo?: Content
    } | {
        /** Acusa erro quando parsing não é completo. */
        readonly required: true
    }

    /** Opções padrões para {@link Options}. */
    const defaultOptions = {
        required: false,
    } as const

    /** Extrai os valores de opção, considerando os padrões. */
    export function extract<T>(options: Options<T> | undefined, defaultsTo: T) {
        const opt = options as { required?: boolean, defaultsTo?: T } | undefined
        return {
            required: opt?.required ?? defaultOptions.required,
            defaultValue: opt?.defaultsTo ?? defaultsTo,
        }
    }

    /**
     * Parseia um objeto como um vetor de `T`s.
     *
     * @param item Objeto qualquer.
     * @param parse Parser do tipo `T`.
     * @param options Opções adicionais de parsing.
     * @returns Vetor com os elementos parseados.
     *
     * @throws {@link Error} - Se `options.required = true` e `item` não for um array.
     *
     * @throws Se `options.required = true` e `parser` dá algum erro.
     */
    export function array<T>(item: any, parse: Parser<T>, options?: Options<T[]>) {
        const { required, defaultValue } = extract(options, [])

        if (Array.isArray(item)) {
            if (!required) {
                // retornas apenas os elementos que dão certo
                return item.flatMap((element) => {
                    try {
                        return [parse(element)]
                    } catch {
                        return []
                    }
                })
            } else {
                // parseia todos e deixa os erros passarem
                return item.map((element) => {
                    return parse(element, { required: true })
                })
            }
        // se não for vetor, retorna padrão ou dá erro
        } else if (!required) {
            return defaultValue
        } else {
            throw new Error(item, 'array')
        }
    }

    /**
     * Parseia um objeto como `string`.
     *
     * @param item Objeto qualquer.
     * @param options Opções adicionais de parsing.
     * @returns `item` como string.
     *
     * @throws {@link Error} Se `options.required = true` e `item` não for string não-vazia.
     */
    export function string(item: any, options?: Options<string>) {
        const { required, defaultValue } = extract(options, '')

        if (typeof item === 'string' && item !== '') {
            return item
        // se não for string, retorna padrão ou dá erro
        } else if (!required) {
            return defaultValue
        } else {
            throw new Error(item, 'string')
        }
    }

    /**
     * Parseia um objeto como inteiro.
     *
     * @param item Objeto qualquer.
     * @param options Opções adicionais de parsing.
     * @returns `item` como inteiro.
     *
     * @throws {@link Error} Se `options.required = true` e `item` não for numérico.
     */
    export function int(item: any, options?: Options<number>) {
        const { required, defaultValue } = extract(options, 0)

        // arredonda inteiros
        if (typeof item === 'number') {
            if (!required || Number.isInteger(item)) {
                return Math.round(item)
            } // else fallthrough

        // ou parseia string
        } else if (typeof item === 'string') {
            const parsed = Number.parseInt(item, 10)
            if (!Number.isNaN(parsed)) {
                return parsed
            } // else fallthrough
        }

        // se não for numérico, retorna padrão ou dá erro
        if (!required) {
            return defaultValue
        } else {
            throw new Error(item, 'integer')
        }
    }

    /**
     * Parseia um objeto como inteiro positivo.
     *
     * @param item Objeto qualquer.
     * @param options Opções adicionais de parsing.
     * @returns Inteiro positivo.
     *
     * @throws {@link Error} Se `options.required = true` e `item` não for numérico.
     */
    export function positiveInt(item: any, options?: Options<number>) {
        const { required, defaultValue } = extract(options, 1)

        const value = int(item, options)
        if (value > 0) {
            return value
        } else if (!required) {
            return defaultValue
        } else {
            throw new Error(item, 'positive integer')
        }
    }

    /**
     * Erros de durante parsing dos dados.
     */
    export class Error<T = unknown> extends TypeError {
        /** Valor que gerou o erro. */
        readonly value: T
        /** Tipo que estava sendo parseado. */
        readonly type: string

        constructor(value: T, type: string) {
            super(`Problema de parsing do objeto '${value}' como tipo '${type}'`)

            this.name = 'Parser.Error'
            this.value = value
            this.type = type
        }
    }
}
