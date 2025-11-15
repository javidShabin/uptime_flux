import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/layouts/mainLayout'
import { Home } from '@/pages/home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
])

