'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { motion } from 'framer-motion'

interface UploadZoneProps {
  onUpload: (file: File) => void
  isLoading: boolean
}

const UploadZone = ({ onUpload, isLoading }: UploadZoneProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0])
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.dcm']
    },
    disabled: isLoading,
    multiple: false
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 transition-all
          ${isDragActive ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-violet-500'}
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-fuchsia-500'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <Upload className="w-12 h-12 text-violet-500 group-hover:text-fuchsia-500" />
          <span className="text-lg text-violet-200">
            {isDragActive
              ? 'Déposez votre image ici'
              : 'Déposez votre radiographie ou cliquez pour sélectionner'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default UploadZone