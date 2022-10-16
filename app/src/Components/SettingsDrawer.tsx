import { makeStyles, theme } from '@/theme';
import { ChevronLeft, Inbox, Mail } from '@mui/icons-material';
import { Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Slider, Tooltip } from '@mui/material';

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
                    <Tooltip title='Close Settings'>
                        <ListItemButton onClick={props.onCloseButtonPressed}>
                            <ListItemIcon>
                                <ChevronLeft />
                            </ListItemIcon>
                            <ListItemText primary='Close' />
                        </ListItemButton>
                    </Tooltip>
                </ListItem>
            </List>
            <Divider />
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <Inbox /> : <Mail />}
                            </ListItemIcon>
                            <ListItemText primary={text + ' -- ' + index} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['All mail', 'Trash', 'Spam'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <Inbox /> : <Mail />}
                            </ListItemIcon>
                            <ListItemText primary={text + ' -- ' + index} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                <ListItem>
                    <Slider value={30} max={100} min={0} step={1} />
                </ListItem>
            </List>
        </Drawer>
    );
}
