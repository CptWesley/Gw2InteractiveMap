import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/views/App';
import reportWebVitals from '@/reportWebVitals';
import ErrorPage from '@/views/ErrorPage';
import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';
import HelloWorld from '@/views/HelloWorld';
import WorldMap from '@/views/WorldMap';
import About from '@/views/About';

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
                    element: <WorldMap />,
                },
                {
                    path: 'changelog',
                    element: <HelloWorld />,
                },
                {
                    path: 'about',
                    element: <About />,
                },
            ],
        },
    ],
    {
        basename: '/Gw2InteractiveMap',
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
