import type { And, Digit, Extends, Formattable, LowercaseAscii, Not, Resolve } from 'types/basic'

/** String com `From` trocado para `To`. */
export type Replaced<Text extends Formattable, From extends Formattable, To extends Formattable>
    = Text extends `${infer Start}${From}${infer End}`
        ? `${Start}${To}${Replaced<End, From, To>}`
        : Text

/**
 * Retorna se `Text` é uma repetição de 1 ou mais vezes de `Char`. Se `Emptiable` é `true`,
 * também valida repetições de 0 vezes, isto é, a string vazia.
 */
export type Repeats<Char extends Formattable, Text extends Formattable, Emptiable = false>
    = Text extends `${Char}${infer Rest}`
        ? Repeats<Char, Rest, true>
        : Extends<Text, '', Emptiable>

/**
 * Se `Text` é a representação em string de um número positivo, ou seja, uma
 * composição de {@link Digit}s sem sinal e sem zeros à esquerda.
 */
export type IsIntString<Text extends Formattable>
    = Text extends `${Exclude<Digit, 0>}${infer Rest}`
        ? Repeats<Digit, Rest, true>
        : Extends<Text, '0'>

/** Se `Text` é composto apenas de {@link LowercaseAscii}. */
export type IsAsciiLowercase<Text extends Formattable>
    = Repeats<LowercaseAscii, Text>

/**
*  Retorna se `Text` é composto de substrings não-vazias separadas por 1 ou mais `Char`s. Se
* `Emptiable` é `true`, também valida repetições de 0 vezes, isto é, apenas
* {@link IsAsciiLowercase}.
*/
export type IsTextSeparatedBy<
    Char extends Formattable,
    Text extends Formattable,
    Empty extends boolean = true,
>
    = Text extends `${infer Start}${Char}${infer Rest}`
        ? And<IsAsciiLowercase<Start>, IsTextSeparatedBy<Char, Rest, false>>
        : And<IsAsciiLowercase<Text>, Not<Empty>>

type OptionalChar<Predicate extends boolean, Char extends Formattable>
    = Resolve<Predicate, Char | ''> | ''

/** Se `Text` é um {@link URL.pathname}, composto de palavras separadas por `'/'`. */
export type IsPathname<
    Text extends Formattable,
    Leading extends boolean = true,
    Trailing extends boolean = true,
>
    = Text extends OptionalChar<And<Leading, Trailing>, '/'>
        ? true
        : Text extends `${OptionalChar<Leading, '/'>}${infer Main}${OptionalChar<Trailing, '/'>}`
            ? IsTextSeparatedBy<'/', Main, false>
            : false
