import { getCharacterOptions } from '@/logic/completedStorage';
import { icons } from '@/logic/mapIcons';
import { makeStyles } from '@/theme';
import { ChevronLeft } from '@mui/icons-material';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, Tooltip, Typography } from '@mui/material';
import SettingsCheckbox from './SettingsCheckbox';
import SettingsSelect from './SettingsSelect';
import SettingsSlider from './SettingsSlider';
import SettingsTab from './SettingsTab';

const useStyles = makeStyles()(() => {
    return {
        settingsDrawer: {
            minHeight: 0,
        },
        iconPreview: {
            block: 'inline',
            float: 'right',
            width: '32px',
            height: '32px',
        },
    };
});

interface IProps {
    container?: Element|undefined|null
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
                },
            }}
            BackdropProps={{
                style: { position: 'absolute' },
            }}
            ModalProps={{
                container: props.container ?? null,
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
                <SettingsCheckbox text='Show Incomplete Point of Interest' tooltip='Indicates whether or not to show incomplete Point of Interest.' setting='showPoiIncomplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.poi.incompleteUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Complete Point of Interest' tooltip='Indicates whether or not to show complete Point of Interest.' setting='showPoiComplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.poi.completeUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Incomplete Vista' tooltip='Indicates whether or not to show incomplete Vista.' setting='showVistaIncomplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.vista.incompleteUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Complete Vista' tooltip='Indicates whether or not to show complete Vista.' setting='showVistaComplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.vista.completeUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Incomplete Waypoint' tooltip='Indicates whether or not to show incomplete Waypoint.' setting='showWaypointIncomplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.waypoint.incompleteUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Complete Waypoint' tooltip='Indicates whether or not to show complete Waypoint.' setting='showWaypointComplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.waypoint.completeUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Incomplete Task' tooltip='Indicates whether or not to show incomplete Task.' setting='showTaskIncomplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.heart.incompleteUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Complete Task' tooltip='Indicates whether or not to show complete Task.' setting='showTaskComplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.heart.completeUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Incomplete Hero Challenge' tooltip='Indicates whether or not to show incomplete Hero Challenge.' setting='showChallengeIncomplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.hero_challenge.incompleteUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Complete Hero Challenge' tooltip='Indicates whether or not to show complete Hero Challenge.' setting='showChallengeComplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.hero_challenge.completeUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Incomplete Mastery Insight' tooltip='Indicates whether or not to show incomplete Mastery Insight.' setting='showMasteryIncomplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.mastery_tyria.incompleteUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Complete Mastery Insight' tooltip='Indicates whether or not to show complete Mastery Insight.' setting='showMasteryComplete' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.mastery_tyria.completeUrl} />
                </SettingsCheckbox>
                <SettingsCheckbox text='Show Adventure' tooltip='Indicates whether or not to Adventure.' setting='showAdventure' onSettingChanged={props.onSettingsChanged}>
                    <img className={classes.iconPreview} src={icons.adventure.completeUrl} />
                </SettingsCheckbox>
            </SettingsTab>
            <Divider />
            <SettingsTab text='Borders' tooltip='Show/Hide border settings.'>
                <SettingsSlider text='Region Border zoom' tooltip='Sets the zoom distance where the region borders are shown.' setting={['showRegionBorderDistanceMin', 'showRegionBorderDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
                <SettingsSlider text='Region Text zoom' tooltip='Sets the zoom distance where the region texts are shown.' setting={['showRegionTextDistanceMin', 'showRegionTextDistanceMax']} min={0} max={10} step={0.25} onSettingChanged={props.onSettingsChanged}/>
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
            <SettingsTab text='Characters' tooltip='Show/Hide character settings.'>
                <SettingsSelect text='Character' tooltip='Selects which character to use for data.' setting='characterId' options={getCharacterOptions()} onSettingChanged={props.onSettingsChanged}/>
            </SettingsTab>
            <Divider />
        </Drawer>
    );
}
