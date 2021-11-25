import type { Formattable, Filtered, Joined as ArrayJoined } from 'types/basic'
import type { Replaced } from 'types/string'

export namespace Space {
    /** Espaço em branco que evita quebras de linha. */
    export type NonBreaking = typeof nonBreaking
    /** Espaço em branco que evita quebras de linha. */
    export const nonBreaking = '\u00A0'

    /** Regex que dá match com espaços. */
    const singleSpace = /\s/g

    /** Troca espaços quaisquer por {@link nonBreaking}. */
    export function withNonBreaking<Text extends string>(
        text: Text,
    ): Replaced<Text, ' ', NonBreaking> {
        return text.replaceAll(singleSpace, nonBreaking) as Replaced<Text, ' ', NonBreaking>
    }

    /** Regex que dá match com {@link nonBreaking}. */
    const singleNonBreaking = /\u00A0/g

    /** Troca {@link nonBreaking} por espaços comuns. */
    export function restore<Text extends string>(
        text: Text,
    ): Replaced<Text, NonBreaking, ' '> {
        return text.replaceAll(singleNonBreaking, ' ') as Replaced<Text, NonBreaking, ' '>
    }
}

/** Retorno de {@link joined}, que limpa valores {@link Falsy} antes de dar {@link Array.join}. */
export type Joined<Args extends readonly Formattable[], Sep extends string = ' '>
    = ArrayJoined<Filtered<Args>, Sep>

/** Junta todas os valores não-vazios em uma só, usando espaço como separador.  */
export function joined<Args extends readonly Formattable[]>(...args: Args): Joined<Args> {
    return args.filter(Boolean).join(' ') as Joined<Args>
}
