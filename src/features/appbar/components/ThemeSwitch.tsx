import React, { useCallback } from 'react'
import { FormControlLabel, Switch } from '@mui/material'
import { css } from '@emotion/css'

import { useThemeMode } from 'providers/Theme'

/** ID do componente {@link ThemeSwitch}. */
const switchId = 'theme-switch'
/** Descirção textual do {@link ThemeSwitch}. */
const switchLabel = 'Tema Escuro'
/** Formatação do label em {@link ThemeSwitch}. */
const switchLabelProps = {
    typography: {
        noWrap: true,
        className: css`
            padding: 0 1ch;
        `,
    },
}

/** Seletor de tema para testes. */
export default function ThemeSwitch() {
    const [theme, setTheme] = useThemeMode()
    const checked = (theme === 'dark')

    const changeTheme = useCallback(
        (_, isChecked: boolean) => {
            setTheme(isChecked ? 'dark' : 'light')
        },
        [setTheme],
    )

    return (
        <FormControlLabel
            id={switchId}
            label={switchLabel}
            aria-label={switchLabel}
            labelPlacement="end"
            control={(
                <Switch
                    checked={checked}
                    onChange={changeTheme}
                    inputProps={{
                        'aria-labelledby': switchId,
                        role: 'switch',
                    }}
                />
            )}
            componentsProps={switchLabelProps}
        />
    )
}
