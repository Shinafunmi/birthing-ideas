import React, { useState } from 'react'
import { dummyUserData } from '../assets/assets'
import { Image } from 'lucide-react'
import toast from 'react-hot-toast'

const CreatePost = () => {

  const [content, setContent] = useState('')
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const user = dummyUserData;

  const handleSubmit = async () => {
    
  }

  return (
    <div className='min-h-screen bg-linear-to-b from-slate-50 to-white'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Title */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-slate-900 mb-2'>Create Post</h1>
          <p className='text-slate-600'>share your thoughts with the world</p>
        </div>
        {/* Form */}
        <div className="max-w-xl bg-white p-4 sm:pb-3 rounded-xl shadow-md space-y-4">
          {/* header */}
            <div className="flex items-center gap-3">
              <img src={user.profile_picture}  alt="" className='w-12 h-12 rounded-full shadow' />
              <div>
                <h2 className='font-bold text-slate-900'>{user.full_name}</h2>
                <p className='text-slate-500'>@{user.username}</p>
              </div>
            </div>

            {/* text area */}
            <textarea
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="4"
            />

            {/* image upload */}

            <div className="flex items-center gap-3">
              <input
                type="file"
                id="image-upload"
                className = "hidden"
                multiple
                accept="image/*"               
                onChange={(e) => setImages([...images, ...e.target.files])}
              />
              <label htmlFor="image-upload" className="bg-blue-500 text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-blue-600">
                <Image className='size-6' />
              </label>

              <button disabled={loading} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600" onClick={()=> toast.promise(handleSubmit(), {
                loading: 'Creating post...',
                success: 'Post created!',
                error: 'Error creating post',
              })}>
                Create
                Post
              </button>
            </div>

        </div>
        
      </div>

    </div>
  )
}

export default CreatePost