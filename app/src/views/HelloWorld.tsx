import Logo from '@/icons/Logo';
import { makeStyles } from '@/theme';
import { useLocation } from 'react-router-dom';
import { SvgIcon } from '@mui/material';

const useStyles = makeStyles()(() => {
    return {
        logo: {
            height: '40vmin',
            pointerEvents: undefined,
        },
    };
});

interface IProps {
    msg?: string
}

export default function HelloWorld(props: IProps) {
    const { classes } = useStyles();
    const path = useLocation();

    return (
        <div>
            <div>
                <SvgIcon className={classes.logo} component={Logo}/>
            </div>
            <div>
                {props.msg ?? 'Hello World'}, from '{path.pathname}'!
            </div>
        </div>
    );
}
