import { Outlet } from 'react-router-dom'
import { Header } from '@/components/Header'

export const MainLayout = () => {
  return (
    <div className=" bg-slate-950">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
