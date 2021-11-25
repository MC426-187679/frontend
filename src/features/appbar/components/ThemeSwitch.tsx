import React, { useCallback } from 'react'
import { FormControlLabel, Switch, type SwitchProps } from '@mui/material'
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

/** Descirção textual do {@link SwitchControl}. */
const switchLabelId = 'theme-switch-label'
/** Formatação do label em {@link SwitchControl}. */
const switchLabelProps = {
    typography: {
        noWrap: true,
        className: css`
            padding: 0 1ch;
        `,
        id: switchLabelId,
    },
}
/** Formatação do {@link FormControlLabel} em {@link SwitchControl}. */
const switchControlClass = css`
    margin-left: 0;
    margin-right: 0;
`

type SwicthControlProps = Omit<SwitchProps, 'inputProps'>

/** Formatação para o {@link ThemeSwitch}. */
function SwitchControl(props: SwicthControlProps) {
    return (
        <FormControlLabel
            label="Tema Escuro"
            className={switchControlClass}
            labelPlacement="end"
            control={(
                <Switch
                    {...props}
                    inputProps={{
                        'aria-labelledby': switchLabelId,
                        role: 'switch',
                    }}
                />
            )}
            componentsProps={switchLabelProps}
        />
    )
}
