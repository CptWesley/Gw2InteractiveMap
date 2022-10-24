import { getSetting, setSetting } from '@/logic/settingsStorage';
import { FormControl, FormGroup, InputLabel, ListItem, MenuItem, Select, SelectChangeEvent, Tooltip } from '@mui/material';
import React, { ReactNode } from 'react';

interface IProps {
    setting: keyof Settings,
    onSettingChanged: () => void,
    text?: string,
    tooltip?: string,
    options: { text: string, value: string }[],
}

export default function SettingsSelect(props: IProps) {
    let defaultSelected = getSetting(props.setting) as string;
    if (!props.options.some(x => x.value === defaultSelected)) {
        defaultSelected = props.options.length > 0 ? props.options[0].value : '';
        setSetting(props.setting, defaultSelected, props.onSettingChanged);
    }

    const [value, setValue] = React.useState<string>(defaultSelected);

    const handleChange = (event: SelectChangeEvent) => {
        const newValue = event.target.value;
        setSetting(props.setting, newValue, props.onSettingChanged);
        setValue(newValue);
    };

    const options: ReactNode[] = props.options.map(x => {
        return <MenuItem key={x.value} value={x.value}>{x.text}</MenuItem>;
    });

    return (
        <ListItem disablePadding style={{
            width: '100%',
            minWidth: '20vw',
        }}>
            <FormGroup>
                <FormControl variant='standard' sx={{
                    marginLeft: '1vw',
                    minWidth: '18vw',
                    marginRight: '1vw',
                }}>
                    <Tooltip title={props.tooltip}>
                        <InputLabel>{props.text}</InputLabel>
                    </Tooltip>
                    <Select
                        label={props.text}
                        value={value}
                        onChange={handleChange}
                    >
                        {options}
                    </Select>
                </FormControl>
            </FormGroup>
        </ListItem>
    );
}
