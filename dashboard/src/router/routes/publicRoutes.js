import { lazy } from 'react';

const Home = lazy(() => import('./../../views/Home'));
const Login = lazy(() => import('./../../views/auth/Login'));
const Register = lazy(() => import('./../../views/auth/Register'));
const AdminLogin = lazy(() => import('./../../views/auth/AdminLogin'));
const Unauthorized = lazy(() => import('./../../views/components/UnAuthorized'));
const Success = lazy(() => import('./../../views/Success'));

const publicRoutes = [
    {
        path: '/',
        element: <Home />,
        ability: ['admin', 'seller']
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/admin/login',
        element: <AdminLogin />
    },
    {
        path: '/unauthorized',
        element: <Unauthorized />
    },
    {
        path: '/success?',
        element: <Success />
    },
]

export default publicRoutes;