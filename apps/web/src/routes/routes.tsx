import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/layouts/mainLayout'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
    ],
  },
])

