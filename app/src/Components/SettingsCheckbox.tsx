import { getSetting, setSetting } from '@/logic/settingsStorage';
import { Checkbox, FormControlLabel, FormGroup, ListItem, Tooltip } from '@mui/material';
import React from 'react';

interface IProps {
    setting: keyof Settings,
    onSettingChanged: () => void,
    text?: string,
    tooltip?: string,
    children?: JSX.Element|JSX.Element[]|string|number|boolean,
}

export default function SettingsCheckbox(props: IProps) {
    const [value, setValue] = React.useState<boolean>(getSetting(props.setting) as boolean);

    const handleChange = (event: any, newValue: boolean) => {
        setSetting(props.setting, newValue, props.onSettingChanged);
        setValue(newValue);
    };

    return (
        <Tooltip title={props.tooltip}>
            <ListItem disablePadding style={{
                width: '100%',
                minWidth: '20vw',
            }}>
                <FormGroup>
                    <FormControlLabel
                        control={<Checkbox
                            checked={value}
                            style={{
                                marginLeft: '16px',
                                float: 'left',
                            }}
                            onChange={handleChange}/>}
                        label={props.text} />
                </FormGroup>
                {props.children}
            </ListItem>
        </Tooltip>
    );
}
