/** Função que parseia um objeto qualquer como tipo `Content`. */
export interface Parser<Content> {
    (item: unknown, options?: Parser.Options<Content>): Content
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

    /** Objeto para comparação de texto insensitivo. */
    const collator = new Intl.Collator('pt-BR', {
        usage: 'sort',
        sensitivity: 'base',
        ignorePunctuation: true,
        numeric: false,
        caseFirst: 'upper',
    })

    /** Ordena o vetor e retorna os elementos com chaves distintas. */
    function uniques<T>(items: T[], key: (item: T) => string) {
        items.sort((a, b) => collator.compare(key(a), key(b)))

        let lastKey = ''
        const uniqueItems = items.filter((item) => {
            if (collator.compare(key(item), lastKey) !== 0) {
                lastKey = key(item)
                return true
            } else {
                return false
            }
        })
        return uniqueItems
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
    export function array<T>(item: unknown, parse: Parser<T>, options?: Options<T[]>) {
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
     * Parser de array ignorando elementos com chave repetida.
     *
     * @param item Objeto qualquer.
     * @param parse Parser do tipo `T`.
     * @param key Extração da chave única do elemento.
     * @param options Opções adicionais de parsing.
     * @returns Vetor com os elementos parseados.
     */
    export function distincts<T>(
        item: unknown,
        parse: Parser<T>,
        key: (item: T) => string,
        options?: Options<T[]>,
    ) {
        return uniques(array(item, parse, options), key)
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
    export function string(item: unknown, options?: Options<string>) {
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
    export function int(item: unknown, options?: Options<number>) {
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
     * @param includeZero Se zero deve ser considerado válido.
     * @param options Opções adicionais de parsing.
     * @returns Inteiro positivo.
     *
     * @throws {@link Error} Se `options.required = true` e `item` não for numérico.
     */
    export function positiveInt(
        item: unknown,
        { includeZero, ...options }: Options<number> & { includeZero?: boolean } = {},
    ) {
        const { required, defaultValue } = extract(options, 1)

        const value = int(item, options)
        if (value > 0 || (includeZero && value === 0)) {
            return value
        } else if (!required) {
            return defaultValue
        } else {
            throw new Error(item, 'positive integer')
        }
    }

    /**
     * Garante que o objeto pode ser acessado com chaves `[]` ou com ponto `item.prop`.
     *
     * @param item um item qualquer.
     * @throws {@link Error} se `item` for `null` ou `undefined`, já que eles dão erro ao serem
     *  acessados.
     */
    export function assertCanBeAcessed(item: unknown):
        asserts item is Record<string | symbol, unknown> {
        // apenas null e undefined dão erro quando acessados, o resto retorna undefined
        if (item === undefined || item === null) {
            throw new Error(item, 'não nulo')
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
