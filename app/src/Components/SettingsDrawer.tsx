import { makeStyles, theme } from '@/theme';
import { ChevronLeft } from '@mui/icons-material';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, Tooltip, Typography } from '@mui/material';
import SettingsCheckbox from './SettingsCheckbox';
import SettingsSlider from './SettingsSlider';
import SettingsTab from './SettingsTab';

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
            <SettingsTab text='Icons' tooltip='Show/Hide icon settings.'>
                <SettingsSlider text='Show zoom' tooltip='Sets the zoom distance where the icons are shown.' setting={['showIconDistanceMin', 'showIconDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
                <SettingsSlider text='Size' tooltip='Sets the size of the icons on the map.' setting='iconSize' min={12} max={64} onSettingChanged={props.onSettingsChanged}/>
            </SettingsTab>
            <Divider />
            <SettingsTab text='Borders' tooltip='Show/Hide border settings.'>
                <SettingsSlider text='Zone Border zoom' tooltip='Sets the zoom distance where the zone borders are shown.' setting={['showZoneBorderDistanceMin', 'showZoneBorderDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
                <SettingsSlider text='Zone Text zoom' tooltip='Sets the zoom distance where the zone texts are shown.' setting={['showZoneTextDistanceMin', 'showZoneTextDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
                <SettingsSlider text='Area Border zoom' tooltip='Sets the zoom distance where the area borders are shown.' setting={['showAreaBorderDistanceMin', 'showAreaBorderDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
                <SettingsSlider text='Area Text zoom' tooltip='Sets the zoom distance where the area texts are shown.' setting={['showAreaTextDistanceMin', 'showAreaTextDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
            </SettingsTab>
            <Divider />
            <SettingsTab text='Expansions' tooltip='Show/Hide expansion settings.'>
                <SettingsCheckbox text='Guild Wars 2' tooltip='Indicates whether or not to show base game content.' setting='showExpansionBase' onSettingChanged={props.onSettingsChanged}/>
                <SettingsCheckbox text='Living World Season 2' tooltip='Indicates whether or not to show Living World Season 2 content.' setting='showExpansionLw2' onSettingChanged={props.onSettingsChanged}/>
                <SettingsCheckbox text='Heart of Thorns' tooltip='Indicates whether or not to show Heart of Thorns content.' setting='showExpansionHot' onSettingChanged={props.onSettingsChanged}/>
                <SettingsCheckbox text='Living World Season 3' tooltip='Indicates whether or not to show Living World Season 3 content.' setting='showExpansionLw3' onSettingChanged={props.onSettingsChanged}/>
                <SettingsCheckbox text='Path of Fire' tooltip='Indicates whether or not to show Path of Fire content.' setting='showExpansionPof' onSettingChanged={props.onSettingsChanged}/>
                <SettingsCheckbox text='Living World Season 4' tooltip='Indicates whether or not to show Living World Season 4 content.' setting='showExpansionLw4' onSettingChanged={props.onSettingsChanged}/>
                <SettingsCheckbox text='Icebrood Saga (LW 5)' tooltip='Indicates whether or not to show Living World Season 5 content.' setting='showExpansionLw5' onSettingChanged={props.onSettingsChanged}/>
                <SettingsCheckbox text='End of Dragons' tooltip='Indicates whether or not to show End of Dragons content.' setting='showExpansionEod' onSettingChanged={props.onSettingsChanged}/>
            </SettingsTab>
            <Divider />
        </Drawer>
    );
}
