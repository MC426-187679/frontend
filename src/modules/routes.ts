import type { ExtractRouteParams } from 'react-router'

type RouteParams<Path extends string> = {
    [K in keyof ExtractRouteParams<Path, string>]?: string
}

/**
 *  Objeto retornado por {@link useParams} quando
 * o componente está na URL dada por {@link Path}.
 */
export type Params<Path extends string> = (
    ExtractRouteParams<Path, string> extends RouteParams<Path>
        ? ExtractRouteParams<Path, string>
        : never
)

/** Componente com rota associada. */
export type RoutedComponent<Path extends string> = (() => JSX.Element) & { path: Path }

/** Gera componente com URL associada. */
export function withPath<Path extends string>(
    path: Path,
    component: () => JSX.Element,
): RoutedComponent<Path> {
    // insere URL no objeto
    return Object.assign(component, { path })
}
