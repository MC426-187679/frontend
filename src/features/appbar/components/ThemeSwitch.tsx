import React, { ChangeEvent, useCallback } from 'react'
import { FormControlLabel, Switch } from '@mui/material'
import { css } from '@emotion/css'

import { useThemeMode } from 'providers/Theme'

/** Seletor de tema. */
export default React.memo(
    function ThemeSwitch() {
        const [theme, setTheme] = useThemeMode()
        const checked = (theme === 'dark')

        const changeTheme = useCallback(
            (_, isChecked: boolean) => {
                setTheme(isChecked ? 'dark' : 'light')
            },
            [setTheme],
        )

        return <SwitchControl checked={checked} onChange={changeTheme} />
    },
    // sempre igual
    () => true,
)

/** ID do componente {@link SwitchControl}. */
const switchId = 'theme-switch'
/** Descirção textual do {@link SwitchControl}. */
const switchLabel = 'Tema Escuro'
/** Formatação do label em {@link SwitchControl}. */
const switchLabelProps = {
    typography: {
        noWrap: true,
        className: css`
            padding: 0 1ch;
        `,
    },
}
/** Formatação do {@link FormControlLabel} em {@link SwitchControl}. */
const switchControlClass = css`
    margin-left: 0;
    margin-right: 0;
`

interface SwitchControlProps {
    /** Se o switch deve estar marcado. */
    checked: boolean
    /** Callback de mudança no switch. */
    onChange?: (event: ChangeEvent<HTMLInputElement>, checked: boolean) => void
}

/** Formatação para o {@link ThemeSwitch}. */
function SwitchControl({ checked, onChange }: SwitchControlProps) {
    return (
        <FormControlLabel
            id={switchId}
            label={switchLabel}
            aria-label={switchLabel}
            className={switchControlClass}
            labelPlacement="end"
            control={(
                <Switch
                    checked={checked}
                    onChange={onChange}
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
