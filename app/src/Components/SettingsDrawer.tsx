import { makeStyles, theme } from '@/theme';
import { ChevronLeft, ExpandLess, ExpandMore, ImageOutlined } from '@mui/icons-material';
import { Collapse, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography } from '@mui/material';
import React from 'react';
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

    const [iconsOpen, setIconsOpen] = React.useState<boolean>(false);
    const [bordersOpen, setBordersOpen] = React.useState<boolean>(false);

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
                <Tooltip title='Show/Hide icon settings.'>
                    <ListItemButton onClick={() => setIconsOpen(!iconsOpen)}>
                        <ListItemIcon>
                            <ImageOutlined />
                        </ListItemIcon>
                        <ListItemText primary='Icons' />
                        {iconsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </Tooltip>
                <Collapse in={iconsOpen} timeout='auto'>
                    <List component='div' disablePadding>
                        <SettingsSlider text='Show zoom' tooltip='Sets the zoom distance where the icons are shown.' setting={['showIconDistanceMin', 'showIconDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
                        <SettingsSlider text='Size' tooltip='Sets the size of the icons on the map.' setting='iconSize' min={12} max={64} onSettingChanged={props.onSettingsChanged}/>
                    </List>
                </Collapse>
            </List>
            <Divider />
            <List>
                <Tooltip title='Show/Hide border settings.'>
                    <ListItemButton onClick={() => setBordersOpen(!bordersOpen)}>
                        <ListItemIcon>
                            <ImageOutlined />
                        </ListItemIcon>
                        <ListItemText primary='Borders' />
                        {bordersOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </Tooltip>
                <Collapse in={bordersOpen} timeout='auto'>
                    <List component='div' disablePadding>
                        <SettingsSlider text='Zone Border zoom' tooltip='Sets the zoom distance where the zone borders are shown.' setting={['showZoneBorderDistanceMin', 'showZoneBorderDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
                        <SettingsSlider text='Zone Text zoom' tooltip='Sets the zoom distance where the zone texts are shown.' setting={['showZoneTextDistanceMin', 'showZoneTextDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
                        <SettingsSlider text='Area Border zoom' tooltip='Sets the zoom distance where the area borders are shown.' setting={['showAreaBorderDistanceMin', 'showAreaBorderDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
                        <SettingsSlider text='Area Text zoom' tooltip='Sets the zoom distance where the area texts are shown.' setting={['showAreaTextDistanceMin', 'showAreaTextDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
                    </List>
                </Collapse>
            </List>
            <Divider />
        </Drawer>
    );
}
