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
export type Parser<T> = (item: any) => T

/** Adapta um {@link Parser} para ignorar erros de parsing. */
function tryParseWith<T>(parser: Parser<T>): Parser<[T] | []> {
    return (item) => {
        try {
            return [parser(item)]
        } catch {
            return []
        }
    }
}

/**
 * Opções para os Parsers de JSON.
 *
 * Os valores padrões podem ser vistos em {@link defaultOptions}.
 */
export interface ParserOptions {
    /** Se erros de parsing devem ser ignorados. */
    readonly required?: boolean
}

/** Opções padrões para {@link ParserOptions}. */
export const defaultOptions = {
    required: false,
} as const

/** Extrai os valores de opção, considerando os padrões. */
function extract(options?: ParserOptions): Required<ParserOptions> {
    return { ...defaultOptions, ...options }
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
export function parseArray<T>(item: any, parser: Parser<T>, options?: ParserOptions) {
    const { required } = extract(options)

    if (Array.isArray(item)) {
        if (!required) {
            // retornas apenas os elementos que dão certo
            return item.flatMap(tryParseWith(parser))
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
export function parseString(item: any, options?: ParserOptions) {
    const { required } = extract(options)

    if (typeof item === 'string' && item !== '') {
        return item
    // se não for string, retorna vazia ou dá erro
    } else if (!required) {
        return ''
    } else {
        throw new ParsingError(item, 'string')
    }
}
