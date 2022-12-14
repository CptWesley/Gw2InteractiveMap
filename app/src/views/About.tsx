import { makeStyles } from '@/theme';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';
import readme from '@/../../README.md';
import Markdown from '@/Components/Markdown';

const useStyles = makeStyles()(() => {
    return {
        textContainer: {
        },
        text: {
            marginTop: '32px',
            width: '100%',
        },
    };
});

let cached: string|undefined = undefined;

export default function About() {
    const { classes } = useStyles();

    const [readmeText, setReadmeText] = useState<string>('');

    useEffect(() => {
        if (cached) {
            setReadmeText(cached);
        } else {
            fetch(readme)
                .then(data => data.text())
                .then(text => {
                    cached = text;
                    setReadmeText(text);
                });
        }
    }, []);

    return (
        <Container className={classes.textContainer}>
            <Markdown
                className={classes.text}
                children={readmeText}/>
        </Container>
    );
}
