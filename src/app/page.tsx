'use client'

import { use, useState } from 'react'
import { UploadCloud } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { revalidatePath } from 'next/cache'
import { useRouter } from 'next/navigation'
import { useFileContext } from './fileContext'

type CSVData = {
  headers: string[]
  rows: string[][]
}





export default function Page() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const route = useRouter()
  const { fetchFiles } = useFileContext();
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploading(true)
      setError(null)
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('http://localhost:8000/api/upload/', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('File upload failed')
        }

        const data = await response.json()
        await fetchFiles()
        console.log('data succeed')
        route.push(`/${data.id}`)
        // Handle the response data as needed
      } catch (error) {
        console.error('Error uploading file:', error)
        setError('Error uploading file')
      } finally {
        setUploading(false)
      }
    }
  }
  
  return (  
    <div className='p-5 w-full'>
      <div className='mb-6 border-2 border-dashed rounded-lg p-8 text-center border-gray-300 flex justify-center' >
        <Input
          type="file"
          accept=".csv"
          className="hidden"
          id="csv-upload"
          onChange={handleFileUpload}
        />
        <label htmlFor="csv-upload" className="cursor-pointer border rounded-md p-5">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4 text-foreground" >
            Select CSV File
          </div>
        </label>
      </div>
    </div>
  )
}