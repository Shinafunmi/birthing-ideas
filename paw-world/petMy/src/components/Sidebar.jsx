import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate, Link } from 'react-router-dom'
import MenuItems from './MenuItems'
import {  CirclePlus, LogOut } from 'lucide-react'
import {UserButton, useClerk, useUser} from '@clerk/clerk-react'

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const navigate = useNavigate()

    const { user } = useUser()
    const { signOut } = useClerk()

  return (
    <div className={`w-60 xl:w-72 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:fixed top-0 bottom-0 z-20 ${sidebarOpen ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
        <div className='w-full'>
            <img onClick={()=>navigate('/')} src={assets.logo} alt='' className='w-26 ml-7 my-2 cursor-pointer' />
            <hr className='border-gray-300 mb-8' />

            <MenuItems setSidebarOpen={setSidebarOpen} />

            <Link to='/create-post' className='flex items-center justisfy-center gap-3 py-2.5 mt-6 mx-6 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 transition text-white cursor-pointer'>
              <CirclePlus className='w-6 h-6 px-3' />
              Create Post
            </Link>
        </div>
        <div className="w-full border-t border-gray-200 py-4 px-6 flex items-center justify-between ">
            <div className="flex gap-2 items-center cursor-pointer">
                <UserButton />
                <div className="">
                    <h1>{user?.fullName || user?.username || 'User'}</h1>
                    <p className='text-xs text-gray-500'>@{user?.username || 'guest'}</p>
                </div>
            </div>
            <LogOut onClick={()=>signOut()} className='w-4.5 text-gray-600 hover:text-gray-700 transition cursor-pointer' />
        </div>
    </div>
  )
}

export default Sidebar