import { ImageOutlined, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import React from 'react';

interface IProps {
    text?: string
    tooltip?: string
    children?: JSX.Element|JSX.Element[]|string|number|boolean,
}

export default function SettingsTab(props: IProps) {
    const [open, setOpen] = React.useState<boolean>(false);

    return (
        <List>
            <Tooltip title={props.tooltip}>
                <ListItemButton onClick={() => setOpen(!open)}>
                    <ListItemIcon>
                        <ImageOutlined />
                    </ListItemIcon>
                    <ListItemText primary={props.text} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </Tooltip>
            <Collapse in={open} timeout='auto'>
                <List component='div' disablePadding>
                    {props.children}
                </List>
            </Collapse>
        </List>
    );
}
