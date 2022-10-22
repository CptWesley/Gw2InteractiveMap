import { makeStyles } from '@/theme';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import readme from '@/../../README.md';

const useStyles = makeStyles()(() => {
    return {
        textContainer: {
        },
        text: {
            marginTop: '32px',
            width: '100%',
            '& a': {
                color: '#ca61ed',
                textDecoration: 'none',
            },
        },
    };
});

export default function About() {
    const { classes } = useStyles();

    const [readmeText, setReadmeText] = useState<string>('');

    useEffect(() => {
        fetch(readme)
            .then(data => data.text())
            .then(text => {
                setReadmeText(text);
            });
    }, []);

    return (
        <Container className={classes.textContainer}>
            <ReactMarkdown className={classes.text} linkTarget='_blank' children={readmeText}/>
        </Container>
    );
}
