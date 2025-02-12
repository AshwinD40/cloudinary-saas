"use client"

import React, {useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function VideoUpload() {

  const [file, setFile] = useState<File | null>(null)
  const [title , setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const router = useRouter()

  // max file size of 70 mb
  const MAX_FILE_SIZE = 70 * 1024 * 1024

  const handleSubmit = async (event:React.FormEvent) => {
    event.preventDefault()
    if(!file) return ;

    if(file.size > MAX_FILE_SIZE) {
      // add notification
      alert('File is too large')
      return;
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('description', description);
    formData.append('originalSize', file.size.toString());


    try {
      const response = await axios.post('/api/video-upload', formData)

      // check for 200 response
    } catch (error) {
      console.error(error)
    }
    finally{
      setIsUploading(false)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Upload Video</h1>
      <form onSubmit={handleSubmit} className=' space-y-4'>
        {/* Title */}
        <div>
          <label className='label'>
            <span className='label-text'>Title</span>
          </label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='input input-bordered w-full'
            required
          />
        </div>
        {/* Description */}
        <div>
          <label className='label'>
            <span className='label-text'>Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='textarea textarea-bordered w-full'
          />
        </div>
        {/* Video */}
        <div>
          <label className='label'>
            <span className='label-text'>Video</span>
          </label>
          <input
            type='file'
            accept='video/*'
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className='file-input file-input-bordered w-full'
            required
          />
        </div>
        {/* Upload */}
        <button
          type='submit'
          className='btn btn-primary'
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}
