import { Outlet } from 'react-router-dom';
import { GlobalStyles } from 'tss-react';
import { makeStyles, style, theme } from '@/theme';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import '@/style/lato-fonts.css';
import { ThemeProvider } from '@mui/material';
import NavBar from '@/Components/NavBar';

const useStyles = makeStyles()(theme => {
    return {
        app: {
            background: theme.background,
            height: '100vh',
            display: 'flex',
            flexFlow: 'column',
        },
        content: {
            flex: 1,
            minHeight: 0,
            // height: '100%',
        },
        toolbar: {
            fontStyle: 'normal',
        },
        toolbarButton: {
            fontWeight: 'bold',
            // color: theme.buttonColor,
            // background: theme.buttonBackground,
        },
        toolbarIcon: {
            '& svg': {
                height: '100%',
            },
            height: '100%',
        },
    };
});

export default function App() {
    const { classes } = useStyles();

    return (
        <HelmetProvider>
            <GlobalStyles
                styles={{
                    '* ': {
                        boxSizing: 'border-box',
                    },
                    body: {
                        background: style.background,
                        fontFamily: style.bodyFontFamily,
                        fontSize: style.bodyFontSize,
                        color: style.color,
                        margin: 0,
                        height: '100vh',
                    },
                }}
            />
            <Helmet>
                <title>CptWesley's Guild Wars 2 Interactive Map</title>
                <meta name='viewport' content='initial-scale=1, width=device-width' />
            </Helmet>
            <div className={classes.app}>
                <ThemeProvider theme={theme}>
                    <NavBar />
                    <div className={classes.content}>
                        <Outlet />
                    </div>
                </ThemeProvider>
            </div>
        </HelmetProvider>
    );
}
