import React, { useCallback } from 'react'
import { FormControlLabel, Switch } from '@mui/material'

import { useThemeMode } from 'components/loader/ThemeModeProvider'

/** Seletor de tema para testes. */
export default function ThemeSwitch() {
    const [theme, setTheme] = useThemeMode()

    const changeTheme = useCallback(
        (_, checked: boolean) => {
            setTheme(checked ? 'dark' : 'light')
        },
        [setTheme],
    )

    return (
        <FormControlLabel
            label="Tema Escuro"
            control={(
                <Switch
                    checked={theme === 'dark'}
                    onChange={changeTheme}
                    inputProps={{
                        'aria-label': 'Tema Escuro',
                    }}
                />
            )}
        />
    )
}
