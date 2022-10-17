import { makeStyles, theme } from '@/theme';
import { Button, SvgIcon } from '@mui/material';
import Logo from '@/icons/Logo';
import { Link } from 'react-router-dom';

const useStyles = makeStyles()(() => {
    return {
        toolbar: {
            flex: 1,
            fontStyle: 'normal',
            maxHeight: '56px',
            width: '100%',
            background: theme.palette.primary.main,
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)',
            '& svg': {
                height: '100%',
            },
            '& *': {
                marginRight: '5px',
                verticalAlign: 'middle',
                textAlign: 'center',
                fontWeight: 'bold',
            },
            zIndex: 3600,
        },
    };
});

export default function NavBar() {
    const { classes } = useStyles();

    return (
        <div className={classes.toolbar}>
            <SvgIcon component={Logo} />
            <Button component={Link} to='./' color='inherit'>Home</Button>
            <Button component={Link} to='./hello' color='inherit'>Hello</Button>
            <Button component={Link} to='./map' color='inherit'>Map</Button>
        </div>
    );
}
