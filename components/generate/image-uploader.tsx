'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

import { Upload, Image as ImageIcon, X, FileImage, AlertTriangle, Check } from 'lucide-react'

import type { ImageUpload } from '@/app/types/design'

interface ImageUploaderProps {
  onImageSelect: (file: File | null) => void
  maxSize?: number
  accept?: string
  multiple?: boolean
}

export function ImageUploader({
  onImageSelect,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = 'image/*',
  multiple = false
}: ImageUploaderProps) {
  const [uploadState, setUploadState] = useState<ImageUpload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null)

    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0]
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`)
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload an image file.')
      } else {
        setError('Failed to upload file. Please try again.')
      }
      return
    }

    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    const preview = URL.createObjectURL(file)

    setUploadState({
      file,
      preview,
      upload_progress: 0,
      status: 'uploading'
    })

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadState(prev => {
        if (!prev) return null
        const newProgress = Math.min(prev.upload_progress + 10, 100)

        if (newProgress === 100) {
          clearInterval(interval)
          onImageSelect(file)
          return {
            ...prev,
            upload_progress: newProgress,
            status: 'completed'
          }
        }

        return {
          ...prev,
          upload_progress: newProgress
        }
      })
    }, 100)

  }, [onImageSelect, maxSize])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [accept]: [] },
    maxSize,
    multiple,
    disabled: uploadState?.status === 'uploading'
  })

  const handleRemove = () => {
    if (uploadState?.preview) {
      URL.revokeObjectURL(uploadState.preview)
    }
    setUploadState(null)
    setError(null)
    onImageSelect(null)
  }

  const handleBrowse = () => {
    fileInputRef.current?.click()
  }

  const dropzoneVariants = {
    idle: {
      borderColor: 'hsl(var(--border))',
      backgroundColor: 'transparent',
      scale: 1
    },
    active: {
      borderColor: 'hsl(var(--primary))',
      backgroundColor: 'hsl(var(--primary) / 0.05)',
      scale: 1.02
    },
    uploading: {
      borderColor: 'hsl(var(--primary))',
      backgroundColor: 'hsl(var(--primary) / 0.1)',
      scale: 1
    }
  }

  const iconVariants = {
    idle: { scale: 1, rotate: 0 },
    active: { scale: 1.1, rotate: 5 },
    uploading: { scale: 0.9, rotate: 0 }
  }

  if (uploadState && uploadState.status !== 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <motion.img
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={uploadState.preview}
                  alt="Upload preview"
                  className="w-20 h-20 object-cover rounded-lg"
                />
                {uploadState.status === 'completed' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-2 -right-2 bg-primary/50 rounded-full p-1"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm truncate max-w-[200px]">
                      {uploadState.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(uploadState.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {uploadState.status === 'completed' && (
                      <Badge variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        Ready
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemove}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {uploadState.status === 'uploading' && (
                  <div className="space-y-1">
                    <Progress value={uploadState.upload_progress} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Uploading... {uploadState.upload_progress}%
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      <motion.div
        {...getRootProps()}
        variants={dropzoneVariants}
        initial="idle"
        animate={
          uploadState?.status === 'uploading' ? 'uploading' :
          isDragActive ? 'active' : 'idle'
        }
        whileHover={uploadState?.status !== 'uploading' ? 'active' : 'uploading'}
        className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
      >
        <input {...getInputProps()} ref={fileInputRef} />

        <motion.div
          variants={iconVariants}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative">
            <motion.div
              animate={uploadState?.status === 'uploading' ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 2, repeat: uploadState?.status === 'uploading' ? Infinity : 0, ease: 'linear' }}
              className="p-4 bg-primary/10 rounded-full"
            >
              {isDragActive ? (
                <FileImage className="h-8 w-8 text-primary" />
              ) : (
                <Upload className="h-8 w-8 text-primary" />
              )}
            </motion.div>
          </div>

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive ? 'Drop your image here' : 'Upload reference image'}
            </p>
            <p className="text-sm text-muted-foreground">
              Drag & drop or{' '}
              <Button
                variant="link"
                className="p-0 h-auto font-normal"
                onClick={handleBrowse}
                type="button"
              >
                browse files
              </Button>
            </p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, WebP • Max size: {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}