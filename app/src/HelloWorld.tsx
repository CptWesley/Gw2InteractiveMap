import { useLocation } from 'react-router-dom';

interface IProps {
    msg?: string
}

export default function HelloWorld(props: IProps) {
    const path = useLocation();
    return (
        <div>
            {props.msg ?? 'Hello World'}, from '{path.pathname}'!
        </div>
    );
}
