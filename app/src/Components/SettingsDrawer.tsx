import { makeStyles, theme } from '@/theme';
import { ChevronLeft, ExpandLess, ExpandMore, ImageOutlined } from '@mui/icons-material';
import { Collapse, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import React from 'react';
import SettingsCheckbox from './SettingsCheckbox';
import SettingsSlider from './SettingsSlider';

const useStyles = makeStyles()(() => {
    return {
        settingsDrawer: {
            minHeight: 0,
        },
    };
});

interface IProps {
    container: Element|null
    open: boolean
    onCloseButtonPressed: () => void
    onSettingsChanged: () => void
}

export default function SettingsDrawer(props: IProps) {
    const { classes } = useStyles();

    const [iconsOpen, setIconsOpen] = React.useState<boolean>(true);

    return (
        <Drawer
            className={classes.settingsDrawer}
            variant='persistent'
            anchor='left'
            color='primary'
            open={props.open}
            PaperProps={{
                style: {
                    position: 'absolute',
                    backgroundColor: theme.palette.primary.light,
                },
            }}
            BackdropProps={{
                style: { position: 'absolute' },
            }}
            ModalProps={{
                container: props.container,
                style: { position: 'absolute' },
                keepMounted: true,
            }}
        >
            <List>
                <ListItem key='close' disablePadding>
                    <Tooltip title='Close Settings' >
                        <ListItemButton onClick={props.onCloseButtonPressed}>
                            <ListItemIcon>
                                <ChevronLeft />
                            </ListItemIcon>
                            <Typography>Close</Typography>
                        </ListItemButton>
                    </Tooltip>
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItemButton onClick={() => setIconsOpen(!iconsOpen)}>
                    <ListItemIcon>
                        <ImageOutlined />
                    </ListItemIcon>
                    <ListItemText primary='Icons' />
                    {iconsOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={iconsOpen} timeout='auto'>
                    <List component='div' disablePadding>
                        <SettingsCheckbox text='Show' tooltip='Shows/hides the icons on the map.' setting='showIcons' onSettingChanged={props.onSettingsChanged}/>
                        <SettingsSlider text='Size' tooltip='Sets the size of the icons on the map.' setting='iconSize' min={12} max={64} onSettingChanged={props.onSettingsChanged}/>
                    </List>
                </Collapse>
            </List>
            <Divider />
        </Drawer>
    );
}
