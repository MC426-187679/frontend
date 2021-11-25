import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, type ButtonProps } from '@mui/material'

export interface RouterButtonProps extends Omit<ButtonProps<'a'>, 'component'> {
    /** URL para navegação. */
    to?: string | undefined
    /** Apaga a URL atual do histórico. */
    replace?: boolean | undefined
}

/** {@link Button} com subcomponente renderizado por {@link RouterLink}. */
export default React.forwardRef<HTMLAnchorElement, RouterButtonProps>(
    function RouterButton({ to, replace, ...props }, ref) {
        if (typeof to === 'string') {
            return <Button ref={ref} component={RouterLink} {...props} to={to} replace={replace} />
        } else {
            return <Button ref={ref} component="a" {...props} />
        }
    },
)
