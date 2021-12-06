/** Valores que têm valor lógico falso, `Boolean(value) === false`. */
export type Falsy = false | null | undefined | '' | 0 | 0n

/** Primeiro dígito de um número positivo. */
export type LeadingDigit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

/** Dígitos decimais. */
export type Digit = 0 | LeadingDigit

/** Tipos primitivos com transformação padrão para string. */
export type Formattable = string | number | bigint | boolean | null | undefined

/** Caracteres ascii minúsculos. */
export type LowercaseAscii
    = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
    | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

/** Se `T` é um subtipo de `U`. */
export type Extends<T, U, True = true, False = false>
    = T extends U ? True : False

/** Resolve para `True` se `Predicate` pode ser garantido como `true`. */
export type Resolve<Predicate extends boolean, True = true, False = false>
    = Extends<true, Predicate, True, False>

/** Resolve para `false` se `Predicate` é `true`. */
export type Not<Predicate extends boolean, True = true, False = false>
    = Resolve<Predicate, False, True>

/** Resolve uma conjunção de até 5 subtipos booleanos. */
export type And<
    A extends boolean,
    B extends boolean,
    C extends boolean = true,
    D extends boolean = true,
    E extends boolean = true,
    True = true,
    False = false,
> = Resolve<Resolve<A, Resolve<B, Resolve<C, Resolve<D, E>>>>, True, False>

/** Resolve uma disjunção de até 5 subtipos booleanos. */
export type Or<
    A extends boolean,
    B extends boolean,
    C extends boolean = true,
    D extends boolean = true,
    E extends boolean = true,
    True = true,
    False = false,
> = Resolve<A, True, Resolve<B, True, Resolve<C, True, Resolve<D, True, Resolve<E, True, False>>>>>

/**
 * Array apenas com elementos "verdadeiros", retornado por `array.filter(Boolean)`.
 *
 * @see {@link Array.filter}
 * @see {@link Boolean}
 */
export type Filtered<Array extends readonly any[]> =
    Array extends [infer First, ...infer Rest]
        ? First extends Falsy
            ? Filtered<Rest>
            : [First, ...Filtered<Rest>]
        : []

/**
 * Retorno de `array.join(sep)`.
 *
 * @see {@link Array.join}
 */
export type Joined<Array extends Formattable[], Sep extends string>
    = Array extends [infer First, infer Second, ...infer Rest]
    // eslint-disable-next-line max-len
        ? `${Extract<First, Formattable>}${Sep}${Joined<Extract<[Second, ...Rest], Formattable[]>, Sep>}`
        : Array extends [infer First]
            ? `${Extract<First, Formattable>}`
            : ''

/**
 * `Text` separado por `Sep`, como no retorno de `text.split(sep)`.
 *
 *  @see {@link String.split}
 */
export type Split<Text extends string, Sep extends string>
    = Text extends `${infer Start}${Sep}${infer End}`
        ? [Start, ...Split<End, Sep>]
        : [Text]
