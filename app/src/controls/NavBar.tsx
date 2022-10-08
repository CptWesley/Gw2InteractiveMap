import { makeStyles, theme } from '@/theme';
import { Button, SvgIcon } from '@mui/material';
import Logo from '@/icons/Logo';
import { Link } from 'react-router-dom';

const useStyles = makeStyles()(() => {
    return {
        toolbar: {
            fontStyle: 'normal',
            height: '56px',
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
            <Button component={Link} to='./tile/1/1/5/0/0' color='inherit'>Tile</Button>
        </div>
    );
}
