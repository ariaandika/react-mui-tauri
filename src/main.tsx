import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import Login from "./pages/Login"
import Layout from './pages/Layout';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Img from './pages/Img';
import { AuthContext } from '.';
import type { Users } from '../server';

const queryClient = new QueryClient()

const routes = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Home/>
            },
            {
                path: "/tickets",
                element: <Tickets/>
            }
        ]
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/img",
        element: <Img/>
    }
])

function AuthProvider({ children }: { children: JSX.Element }) {
    const user = JSON.parse(localStorage.getItem("access_token") ?? "null");
    const [auth, setAuth] = useState(user);
    const app = {
        auth,
        login(user: Users) {
            localStorage.setItem("access_token", JSON.stringify(user));
            setAuth(user);
        },
        logout() {
            localStorage.removeItem("access_token");
            setAuth(void 0 as any)
        }
    }

    return <AuthContext.Provider value={app}>
        {children}
    </AuthContext.Provider>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={routes}/>
            </QueryClientProvider>
        </AuthProvider>
    </React.StrictMode>
)
