/** Descrição textual do tempo para execução da callback. */
export type Timeout = `${number} ${Unit}`

/** Unidades reconhecidas no {@link Timeout}. */
type Unit = 'ms' | 's' | 'min' | 'h'

/** Multiplicadores para transformação de cada unidade. */
function multiplierToMillis(unit: Unit): number
function multiplierToMillis(unit?: string | undefined): number | undefined
function multiplierToMillis(unit?: unknown) {
    switch (unit) {
        case 'ms':
            return 1
        case 's':
            return 1000
        case 'min':
            return 60 * 1000
        case 'h':
            return 60 * 60 * 1000
        default:
            return undefined
    }
}

/** Tranforma {@link Timeout} em valor númerico em milissegundos. */
export function toMillis(timeout: Timeout) {
    const [value, unit] = timeout.split(' ')
    const numericValue = parseFloat(value)

    const multiplier = multiplierToMillis(unit) ?? 1
    return numericValue * multiplier
}
