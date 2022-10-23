import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import React from 'react';
import { PrismLight } from 'react-syntax-highlighter';
import tsx from 'react-syntax-highlighter/dist/esm/languages/prism/tsx';
import typescript from 'react-syntax-highlighter/dist/esm/languages/prism/typescript';
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json';
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import css from 'react-syntax-highlighter/dist/esm/languages/prism/css';
import dracula from 'react-syntax-highlighter/dist/esm/styles/prism/dracula';

PrismLight.registerLanguage('tsx', tsx);
PrismLight.registerLanguage('typescript', typescript);
PrismLight.registerLanguage('ts', typescript);
PrismLight.registerLanguage('json', json);
PrismLight.registerLanguage('javascript', javascript);
PrismLight.registerLanguage('js', javascript);
PrismLight.registerLanguage('css', css);

const styling = dracula;

const flatten = (text: string, child: any): any => {
    return typeof child === 'string'
        ? text + child
        : React.Children.toArray(child.props.children).reduce(flatten, text);
};

const HeadingRenderer = (props: any) => {
    const children = React.Children.toArray(props.children);
    const text = children.reduce(flatten, '');
    const slug = text.toLowerCase().replace(/[^\w|#]/g, '-');
    return React.createElement('h' + props.level, { id: slug }, props.children);
};

const LinkRenderer = (props: any) => {
    if (props.href.charAt(0) !== '#') {
        return <a href={props.href} target='_blank'>{props.children[0]}</a>;
    }
    const slug = props.href.toLowerCase().replace(/[^\w|#]/g, '-');
    return <a
        href={slug}>
        {props.children[0]}
    </a>;
};

const CodeRenderer = (props: any) => {
    const language = props.className.slice(9);
    const code = props.children[0].trim();
    console.log(props);
    console.log(language);
    console.log(code);
    return <PrismLight
        style={styling}
        language={language}
        children={code}
        showLineNumbers={true}
        showInlineLineNumbers={true}
        PreTag='div'
        useInlineStyles={true}
        customStyle={{
            maxWidth: '80%',
            width: 'fit-content',
            borderWidth: '1px',
            borderRadius: '25px',
        }}
    />;
};

interface IProps {
    children?: string|undefined,
    className?: string|undefined,
}

export default function Markdown(props: IProps) {
    return (
        <ReactMarkdown
            className={props.className}
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[]}
            components={{
                a: LinkRenderer,
                h1: HeadingRenderer,
                h2: HeadingRenderer,
                h3: HeadingRenderer,
                h4: HeadingRenderer,
                h5: HeadingRenderer,
                h6: HeadingRenderer,
                code: CodeRenderer,
            }}
            children={props.children ?? ''}/>
    );
}
