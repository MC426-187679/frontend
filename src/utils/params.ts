/* eslint-disable @typescript-eslint/no-unused-vars */
import { useParams } from 'react-router-dom'

/** Extrai argumentos opcionais da URL. */
type RouteOptionalParam<T extends string, U = string> =
T extends `${infer Param}?`
    ? { [k in Param]?: U }
    : T extends `${infer Param}*`
        ? { [k in Param]?: U }
        : T extends `${infer Param}+`
            ? { [k in Param]: U }
            : { [k in T]: U }

/** Estrutura retornada por {@link useParams} quando a URL é `Path`. */
export type RouteParams<T extends string, U = string> = string extends T
    ? { [k in string]?: U }
    : T extends `${infer _Start}:${infer ParamWithOptionalRegExp}/${infer Rest}`
        ? ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})`
            ? RouteOptionalParam<Param, U> & RouteParams<Rest, U>
            : RouteOptionalParam<ParamWithOptionalRegExp, U> & RouteParams<Rest, U>
        : T extends `${infer _Start}:${infer ParamWithOptionalRegExp}`
            ? ParamWithOptionalRegExp extends `${infer Param}(${infer _RegExp})`
                ? RouteOptionalParam<Param, U>
                : RouteOptionalParam<ParamWithOptionalRegExp, U>
            : {}

/** Componente Base para {@link PageComponent}. */
interface BaseComponent<Path extends string, AdditionalProps extends {} = {}> {
    (props: RouteParams<Path> & AdditionalProps): JSX.Element | null
    readonly displayName?: string | undefined
}

/** Propriedades adicionais do {@link BaseComponent}, além das recuperadas pela URL. */
type AdditionalProps<Path extends string, C extends BaseComponent<Path>> =
    C extends (props: RouteParams<Path> & infer Props) => any
        ? Props
        : never

/** Componente de Ordem Superior que trata dos argumentos da URL para uma página específica. */
export interface PageComponent<Path extends string, C extends BaseComponent<Path>> {
    (props: AdditionalProps<Path, C>): ReturnType<C>
    /** Nome do componente para depuração. */
    readonly displayName: string
    /** Reexportado para o `Router` */
    readonly path: Path
}

export namespace PageComponent {
    /** HOC que monta extrai parâmetros da URL para gerar um componente em página. */
    export function from<
        Path extends string,
        C extends BaseComponent<Path>,
        Options extends {},
    >(
        Component: C,
        options: Options & { readonly path: Path },
    ): PageComponent<Path, C> & Omit<Options, 'path'> {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        function PageComponent(props: AdditionalProps<Path, C>) {
            const params = useParams() as RouteParams<Path>
            return Component({ ...params, ...props }) as ReturnType<C>
        }

        // nome do super componente
        const displayName = `PageComponent(${Component.displayName ?? Component.name})`
        // propriedades adicionais
        return Object.assign(PageComponent, options, { displayName })
    }
}
