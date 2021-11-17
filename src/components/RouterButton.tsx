import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Button, ButtonProps } from '@mui/material'

interface RouterButtonProps extends Omit<ButtonProps<'a'>, 'component'> {
    /** URL para navegação. */
    to?: string | undefined
    /** Apaga a URL atual do histórico. */
    replace?: boolean | undefined
}

/** {@link Button} com subcomponente renderizado por {@link Link}. */
export default function RouterButton({ to, replace, ...props }: RouterButtonProps) {
    if (typeof to === 'string') {
        return <Button component={RouterLink} {...props} to={to} replace={replace} />
    } else {
        return <Button component="a" {...props} />
    }
}
