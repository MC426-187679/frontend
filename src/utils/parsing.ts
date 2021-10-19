/**
 * Erros de durante parsing dos dados.
 */
export class ParsingError<T = unknown> extends TypeError {
    /** Valor que gerou o erro. */
    readonly value: T

    /** Tipo que estava sendo parseado. */
    readonly type: string

    constructor(value: T, type: string) {
        super(`Problema de parsing do objeto '${value}' como tipo '${type}'`)

        this.value = value
        this.type = type
    }
}

/** Função que parseia um objeto qualquer como tipo `T`. */
export interface Parser<T> {
    (item: any): T
}

export namespace Parser {
    /**
     * Opções para os Parsers de JSON.
     *
     * Os valores padrões podem ser vistos em {@link defaultOptions}.
     */
    export interface Options {
        /** Se erros de parsing devem ser ignorados. */
        readonly required?: boolean
    }

    export namespace Options {
        /** Opções padrões para {@link Options}. */
        export const defaultOptions = {
            required: false,
        } as const

        /** Extrai os valores de opção, considerando os padrões. */
        export function extract(options?: Options): Required<Options> {
            return { ...defaultOptions, ...options }
        }
    }

    /**
     * Parseia um objeto como um vetor de `T`s.
     *
     * @param item Objeto qualquer.
     * @param parser Parser do tipo `T`.
     * @param options Opções adicionais de parsing.
     * @returns Vetor com os elementos parseados.
     *
     * @throws {@link ParsingError} - Se `options.required = true`
     * e `item` não for um array.
     *
     * @throws Se `options.required = true` e `parser` dá algum erro.
     */
    export function array<T>(item: any, parser: Parser<T>, options?: Parser.Options) {
        const { required } = Parser.Options.extract(options)

        if (Array.isArray(item)) {
            if (!required) {
                // retornas apenas os elementos que dão certo
                return item.flatMap((element) => {
                    try {
                        return [parser(element)] as const
                    } catch {
                        return [] as const
                    }
                })
            } else {
                // parseia todos e deixa os erros passarem
                return item.map(parser)
            }
        // se não for vetor, retorna vazio ou dá erro
        } else if (!required) {
            return []
        } else {
            throw new ParsingError(item, 'array')
        }
    }

    /**
     * Parseia um objeto como `string` não-vazia.
     *
     * @param item Objeto qualquer.
     * @param options Opções adicionais de parsing.
     * @returns `item` como string.
     *
     * @throws {@link ParsingError} Se `options.required = true`
     * e `item` não for string.
     */
    export function string(item: any, options?: Parser.Options) {
        const { required } = Parser.Options.extract(options)

        if (typeof item === 'string' && item !== '') {
            return item
        // se não for string, retorna vazia ou dá erro
        } else if (!required) {
            return ''
        } else {
            throw new ParsingError(item, 'string')
        }
    }
}
