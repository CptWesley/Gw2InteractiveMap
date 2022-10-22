import { makeStyles, theme } from '@/theme';
import { Button, SvgIcon } from '@mui/material';
import Logo from '@/icons/Logo';
import { Link } from 'react-router-dom';

const useStyles = makeStyles()(() => {
    return {
        toolbar: {
            flex: 0,
            fontStyle: 'normal',
            width: '100%',
            height: 'auto',
            maxHeight: 'fit-content',
            background: theme.palette.primary.main,
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)',
            '& svg': {
                maxHeight: '56px',
            },
            '& *': {
                marginRight: '5px',
                verticalAlign: 'middle',
                textAlign: 'center',
                fontWeight: 'bold',
            },
            zIndex: 3600,
            position: 'sticky',
            top: '0px',
        },
    };
});

export default function NavBar() {
    const { classes } = useStyles();

    return (
        <div className={classes.toolbar}>
            <SvgIcon component={Logo} fontSize='small' />
            <Button component={Link} to='./' color='inherit'>Map</Button>
            <Button component={Link} to='./changelog' color='inherit'>What's New</Button>
            <Button component={Link} to='./about' color='inherit'>About</Button>
        </div>
    );
}
