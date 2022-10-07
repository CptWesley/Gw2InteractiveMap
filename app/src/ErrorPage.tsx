import { useRouteError, useLocation } from 'react-router-dom';

export default function ErrorPage() {
    const error: any = useRouteError();
    const path = useLocation();
    console.error(error);

    return (
        <div id='error-page'>
            <h1>Oops!</h1>
            <p>{error.status || ''}</p>
            <p>Sorry, an unexpected error has occurred while navigating to '{path.pathname}'.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
        </div>
    );
}
