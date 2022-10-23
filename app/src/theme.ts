import { createTheme } from '@mui/material';
import { createMakeStyles } from 'tss-react';

export const palette = {
    primary: '#31274c',
    primaryLight: '#5c4f78',
    primaryDark: '#0d0024',
    primaryText: '#ffffff',
    secondary: '#545454',
    secondaryLight: '#808080',
    secondaryDark: '#2b2b2b',
    secondaryText: '#ffffff',
};

export const theme = createTheme({
    palette: {
        primary: {
            main: palette.primary,
        },
        secondary: {
            main: palette.secondary,
        },
        background: {
            paper: palette.primaryLight,
        },
        text: {
            primary: palette.primaryText,
            secondary: palette.secondaryText,
        },
    },
});

export const style = {
    background: theme.palette.secondary.dark,
    color: theme.palette.secondary.contrastText,
    linkColor: '#ca61ed',
    linkHoverColor: '#ff69b4',

    borderRadiusSmall: 3,
    borderRadiusMedium: 5,

    bodyFontFamily: 'Lato',
    bodyFontSize: 16,

    headerHeight: 32,
    headerBackground: theme.palette.primary.dark,
    headerColor: theme.palette.primary.contrastText,

    buttonColor: theme.palette.primary.contrastText,
    buttonBackground: 'transparent',
    buttonBackgroundHover: 'rgba(255, 255, 255, 0.25)',
    buttonBackgroundPress: 'rgba(255, 255, 255, 0.33)',
    buttonBorderColor: 'rgba(255, 255, 255, 0.75)',
    buttonBorderColorHover: '#ffffff',
    buttonBorderColorPress: '#ffffff',

    textboxBorderColor: '#ffffff',
    textboxBackground: theme.palette.primary.light,
    textboxColor: theme.palette.primary.contrastText,
    textboxHoverBackground: theme.palette.primary.light,
    textboxFocusBackground: '#ffffff',
    textboxFocusColor: '#111111',

    scrollbarColor: '#ffffff',
    detailsBoxBorderColor: 'rgba(255, 255, 255, 0.5)',

    spacing: (...spacings: number[]) => spacings.map(s => `${s * 10}px`).join(' '),
} as const;

function useTheme() {
    return style;
}

export const makeStyles = createMakeStyles({
    useTheme,
}).makeStyles;
