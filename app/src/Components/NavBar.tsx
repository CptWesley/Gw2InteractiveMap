import { makeStyles, theme, style } from '@/theme';
import { Button, SvgIcon, Tooltip } from '@mui/material';
import Logo from '@/icons/Logo';
import { Link } from 'react-router-dom';
import GithubIcon from '@/icons/GithubIcon';
import React from 'react';
import DiscordIcon from '@/icons/DiscordIcon';

const useStyles = makeStyles()(() => {
    return {
        toolbar: {
            flex: 0,
            fontStyle: 'normal',
            width: '100%',
            height: 'fit-content',
            maxHeight: 'fit-content',
            minHeight: 'fit-content',
            background: theme.palette.primary.main,
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)',
            zIndex: 600,
            position: 'sticky',
            top: '0px',
            '& svg': {
                position: 'relative',
                verticalAlign: 'middle',
            },
        },
        leftBar: {
            float: 'left',
            '& > *': {
                verticalAlign: 'middle',
                textAlign: 'center',
                display: 'inline-block',
                width: 'fit-content',
                height: 'max-content',
                marginLeft: '8px',
                paddingTop: '4px',
                paddingBottom: '4px',
            },
            ':last-child': {
                marginLeft: '16px',
            },
            '& svg': {
                width: '48px',
                height: '48px',
                paddingLeft: '4px',
                paddingRight: '4px',
            },
        },
        rightBar: {
            float: 'right',
            '& > *': {
                verticalAlign: 'middle',
                textAlign: 'center',
                display: 'inline-block',
                width: 'fit-content',
                height: 'max-content',
                paddingTop: '16px',
                paddingBottom: '16px',
                marginRight: '8px',
            },
            ':last-child': {
                marginRight: '16px',
            },
            '& svg': {
                width: '24px',
                height: '24px',
            },
        },
    };
});

export default function NavBar() {
    const { classes } = useStyles();

    const [ghColor, setGhColor] = React.useState(theme.palette.text.primary);
    const [discordColor, setDiscordColor] = React.useState(theme.palette.text.primary);

    return (
        <div className={classes.toolbar}>
            <span className={classes.leftBar}>
                <Tooltip title='Show Interactive Map'>
                    <Link to='./'><SvgIcon component={Logo} fontSize='small' /></Link>
                </Tooltip>
                <Tooltip title='Show Interactive Map'>
                    <Button component={Link} to='./' color='inherit'>Map</Button>
                </Tooltip>
                <Tooltip title='Show Changelog'>
                    <Button component={Link} to='./changelog' color='inherit'>What's New</Button>
                </Tooltip>
                <Tooltip title='Show About Page'>
                    <Button component={Link} to='./about' color='inherit'>About</Button>
                </Tooltip>
            </span>
            <span className={classes.rightBar}>
                <Tooltip title='Open Discord Server'>
                    <a
                        href='https://discord.gg/yhQ2Hnuc4f'
                        target='_blank'
                        onMouseEnter={() => setDiscordColor(style.linkHoverColor)}
                        onMouseLeave={() => setDiscordColor(theme.palette.text.primary)}
                        onMouseDown={() => setDiscordColor(style.linkColor)}
                        onMouseUp={() => setDiscordColor(style.linkHoverColor)}>
                        <DiscordIcon color={discordColor}/>
                    </a>
                </Tooltip>
                <Tooltip title='Open GitHub Repository'>
                    <a
                        href='https://github.com/CptWesley/Gw2InteractiveMap'
                        target='_blank'
                        onMouseEnter={() => setGhColor(style.linkHoverColor)}
                        onMouseLeave={() => setGhColor(theme.palette.text.primary)}
                        onMouseDown={() => setGhColor(style.linkColor)}
                        onMouseUp={() => setGhColor(style.linkHoverColor)}>
                        <GithubIcon color={ghColor}/>
                    </a>
                </Tooltip>
            </span>
        </div>
    );
}
