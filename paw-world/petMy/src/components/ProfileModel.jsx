import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Pencil } from 'lucide-react'

const ProfileModel = ({setShowEdit}) => {
    const user = dummyUserData
    const [editForm, setEditForm] = useState({
        username: user.username,
        bio: user.bio,
        location: user.location,
        profile_picture: null,
        cover_photo: null,
        full_name: user.full_name
    })

    const handleSaveProfile = async (e) => {
        e.preventDefault();
    }


  return (
    <div className='fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50'>
        <div className="max-w-2xl sm:py-6 mx-auto">
            <div className="bg-white rounded-lg sahdow p-6">
                <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>
                <form action="" className="space-y-4" onSubmit={handleSaveProfile}>
                    {/* Profile picture */}
                    <div className="flex flex-col items-start gap-2">
                        <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture
                            <input hidden type="file" accept="image/*" id="profile_picture" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" onChange={(e) => setEditForm({...editForm, profile_picture: e.target.files[0]})} />
                            <div className=" group/profile relative">
                            <img src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : user.profile_picture} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
                                <div className="absolute hidden inset-0 bg-black/20  items-center justify-center opacity-0 group-hover/profile:flex cursor-pointer rounded-full">
                                    <Pencil className='w-5 h-5 text-white'  />
                                </div>
                            </div>
                        </label>
                    </div>

                    <div className="flex flex-col items-start gap-3">
                        <label htmlFor="cover_photo" className="block text-sm font-medium text-gray-700">Cover Photo
                             <input hidden type="file" accept="image/*" id="cover_photo" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" onChange={(e) => setEditForm({...editForm, cover_photo: e.target.files[0]})} />
                             <div className=" group/cover relative">
                             <img src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : user.cover_photo} alt="" className="w-full rounded-lg h-48 object-cover" />
                                 <div className="absolute hidden inset-0 bg-black/20  items-center justify-center  group-hover/cover:flex cursor-pointer rounded-md">
                                     <Pencil className='w-5 h-5 pink'  />
                                 </div>
                             </div>
                        </label>
                    </div>
                    <div className="">
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Name
                        </label>
                        <input type="text" placeholder='Enter Name ' className='w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2' value={editForm.full_name} onChange={(e) => setEditForm({...editForm, full_name: e.target.value})} />
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'> Username 
                             <input type="text" placeholder='Enter username ' className='w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2' value={editForm.username} onChange={(e) => setEditForm({...editForm, username: e.target.value})} />
                        </label>
                    </div>

                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Bio
                        </label>
                        <textarea rows={3} type="text" placeholder='Enter Bio' className='w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2' value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} />
                    </div>

                     <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Location
                        </label>
                        <input type="text" placeholder='Enter your location ' className='w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2' value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} />
                        
                    </div>


                    <div className="flex justify-end gap-3">
                        <button onClick={()=> setShowEdit=(false)} type="button" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

        </div>

    </div>
  )
}

export default ProfileModel