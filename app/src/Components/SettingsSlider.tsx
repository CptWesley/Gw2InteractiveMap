import { defaultSettings, getSetting, setSetting, Settings } from '@/logic/settingsStorage';
import { ListItem, ListItemText, Slider, Tooltip } from '@mui/material';
import React from 'react';

interface IProps {
    setting: keyof Settings|(keyof Settings)[]
    min?: number
    max?: number
    step?: number
    onSettingChanged: () => void
    text?: string
    tooltip?: string
    disabled?: boolean|keyof Settings
}

export default function SettingsSlider(props: IProps) {
    const settings = Array.isArray(props.setting) ? props.setting : [props.setting];
    const [value, setValue] = React.useState<number[]>(() => settings.map(s => getSetting(s) as number));

    const handleChange = (event: Event, newValue: number | number[]) => {
        const newValues = newValue as number[];
        for (let i = 0; i < settings.length; i++) {
            const setting = settings[i];
            const value = newValues[i];
            setSetting(setting, value, props.onSettingChanged);
        }
        setValue(newValues);
    };

    const disabled = typeof props.disabled === 'string' ? getSetting(props.disabled) as boolean : props.disabled ?? false;
    const min = props.min ?? 0;
    const max = props.max ?? 0;

    const marks = settings.map(s => {
        return {
            value: defaultSettings[s] as number,
            label: `${defaultSettings[s]} (Default)`,
        };
    });

    function valuetext(value: number) {
        return `${value}`;
    }

    return (
        <Tooltip title={props.tooltip}>
            <ListItem disablePadding style={{
                width: '100%',
                minWidth: '20vw',
            }}>
                <ListItemText
                    primary={`${props.text}:`}
                    style={{
                        width: '45%',
                        marginLeft: '16px',
                        marginRight: '16px',
                        position: 'relative',
                        top: '-10px',
                        float: 'left',
                    }}/>
                <Slider
                    value={value}
                    min={min}
                    max={max}
                    step={props.step ?? 1}
                    valueLabelDisplay='auto'
                    getAriaValueText={valuetext}
                    marks={marks}
                    style={{
                        width: '55%',
                        marginRight: '40px',
                        float: 'right',
                    }}
                    disabled={disabled}
                    onChange={handleChange} />
            </ListItem>
        </Tooltip>
    );
}
