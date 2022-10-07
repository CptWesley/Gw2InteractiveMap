import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ErrorPage from './ErrorPage';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import HelloWorld from './HelloWorld';
import Tile from './Tile';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: '',
                    element: <HelloWorld msg='Hello Index' />,
                },
                {
                    path: 'hello',
                    element: <HelloWorld msg='Hello World' />,
                },
                {
                    path: 'tile/:c/:f/:z/:x/:y',
                    element: <Tile />,
                },
            ],
        },
    ],
    {
        basename: '/autoruntest',
    },
);

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
