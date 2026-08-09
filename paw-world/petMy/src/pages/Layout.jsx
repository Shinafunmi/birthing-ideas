import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import Loading from '../components/Loading'
import { dummyUserData } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'

const Layout = () => {
  // const user = dummyUserData
  const { user, isLoaded } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // const handleLogout = async () => {
  // await signOut()
  // navigate('/')
  // }

  return user? (
    <div className='w-full flex h-screen'>
      <Sidebar sidebarOpen={sidebarOpen} 
      setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 bg-slate-50">
        <Outlet />
      </div>

      <Menu />

      {
        sidebarOpen ? (
           <X className='absolute top-3 right-3p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=>setSidebarOpen(false)} />
        ) :
        <Menu className='absolute top-3 right-3 p-2 z-100 bg-white rounded-md shadow w-10 h-10 text-gray-600 sm:hidden' onClick={()=>setSidebarOpen(true)} />
      }
    </div>
  ) : (
    <Loading />
  )
}

export default Layout