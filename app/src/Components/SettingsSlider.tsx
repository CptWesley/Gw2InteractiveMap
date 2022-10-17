import { defaultSettings, getSetting, setSetting, Settings } from '@/logic/settingsStorage';
import { ListItem, ListItemText, Slider, Tooltip } from '@mui/material';
import React from 'react';

interface IProps {
    setting: keyof Settings
    min?: number
    max?: number
    step?: number
    onSettingChanged: () => void
    text?: string
    tooltip?: string
}

export default function SettingsSlider(props: IProps) {
    const [value, setValue] = React.useState<number>(getSetting(props.setting) as number);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setSetting(props.setting, newValue as number, props.onSettingChanged);
        setValue(newValue as number);
    };

    const min = props.min ?? 0;
    const max = props.max ?? 0;

    const marks = [
        {
            value: defaultSettings[props.setting] as number,
            label: `${defaultSettings[props.setting]} (Default)`,
        },
    ];

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
                        width: '40%',
                        marginLeft: '16px',
                        position: 'relative',
                        top: '-10px',
                        float: 'left',
                    }}/>
                <Slider
                    aria-label='Custom marks'
                    value={value}
                    min={min}
                    max={max}
                    step={props.step ?? 1}
                    valueLabelDisplay='auto'
                    getAriaValueText={valuetext}
                    marks={marks}
                    style={{
                        width: '60%',
                        marginRight: '24px',
                        float: 'right',
                    }}
                    onChange={handleChange} />
            </ListItem>
        </Tooltip>
    );
}
