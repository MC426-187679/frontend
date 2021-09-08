import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'

/**
 * Navigation Links
 */
export default function NavBar() {
    return (
        <>
            <Button component={Link} to="/arvore" color="inherit" size="large">
                Árvore
            </Button>
            <Button component={Link} to="/grade" color="inherit" size="large">
                Grade
            </Button>
        </>
    )
}
