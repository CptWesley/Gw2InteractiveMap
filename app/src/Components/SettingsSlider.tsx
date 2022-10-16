import { defaultSettings, getSetting, setSetting, Settings } from '@/logic/settingsStorage';
import { ListItem, ListItemText, Slider } from '@mui/material';
import React from 'react';

interface IProps {
    setting: keyof Settings
    min?: number
    max?: number
    step?: number
    onSettingChanged: () => void
    text?: string
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
        <ListItem disablePadding style={{
            width: '70%',
            minWidth: '20vw',
        }}>
            <ListItemText
                primary={`${props.text}:`}
                style={{
                    width: '30%',
                    paddingLeft: '8px',
                    position: 'relative',
                    top: '-10px',
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
                onChange={handleChange} />
        </ListItem>
    );
}
