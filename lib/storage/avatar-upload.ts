/**
 * Avatar upload utilities for profile setup
 * Handles file validation, upload to Supabase storage, and URL generation
 */

import { createClient } from '@/lib/supabase/server'

export interface AvatarUploadResult {
  success: boolean
  avatarUrl?: string
  fileName?: string
  error?: string
}

export interface AvatarUploadOptions {
  maxSizeBytes?: number
  allowedMimeTypes?: string[]
  bucketName?: string
}

const DEFAULT_OPTIONS: Required<AvatarUploadOptions> = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  bucketName: 'avatars'
}

/**
 * Validate avatar file
 */
export function validateAvatarFile(
  file: File,
  options: AvatarUploadOptions = {}
): { valid: boolean; error?: string } {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  // Check file size
  if (file.size > opts.maxSizeBytes) {
    const maxMB = opts.maxSizeBytes / (1024 * 1024)
    return {
      valid: false,
      error: `File size must be less than ${maxMB}MB`
    }
  }

  // Check file type
  if (!opts.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Only image files (JPEG, PNG, WebP) are allowed'
    }
  }

  // Check if file is actually an image
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'File must be an image'
    }
  }

  return { valid: true }
}

/**
 * Upload avatar to Supabase storage
 */
export async function uploadAvatar(
  userId: string,
  file: File,
  options: AvatarUploadOptions = {}
): Promise<AvatarUploadResult> {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options }

    // Validate file
    const validation = validateAvatarFile(file, options)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      }
    }

    const supabase = await createClient()

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${userId}/avatar_${timestamp}.${fileExtension}`

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(opts.bucketName)
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: true, // Replace existing file if any
        cacheControl: '3600' // Cache for 1 hour
      })

    if (error) {
      console.error('Supabase storage error:', error)
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(opts.bucketName)
      .getPublicUrl(fileName)

    return {
      success: true,
      avatarUrl: publicUrl,
      fileName
    }

  } catch (error: any) {
    console.error('Error uploading avatar:', error)
    return {
      success: false,
      error: error.message || 'Unknown upload error'
    }
  }
}

/**
 * Delete avatar from storage
 */
export async function deleteAvatar(
  fileName: string,
  options: AvatarUploadOptions = {}
): Promise<boolean> {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    const supabase = await createClient()

    const { error } = await supabase.storage
      .from(opts.bucketName)
      .remove([fileName])

    if (error) {
      console.error('Error deleting avatar:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting avatar:', error)
    return false
  }
}

/**
 * Create avatars bucket if it doesn't exist
 */
export async function ensureAvatarsBucket(
  options: AvatarUploadOptions = {}
): Promise<boolean> {
  try {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    const supabase = await createClient()

    const { error } = await supabase.storage.createBucket(opts.bucketName, {
      public: true,
      allowedMimeTypes: opts.allowedMimeTypes,
      fileSizeLimit: opts.maxSizeBytes
    })

    if (error && error.message !== 'Bucket already exists') {
      console.error('Error creating avatars bucket:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error ensuring avatars bucket:', error)
    return false
  }
}

/**
 * Extract filename from avatar URL for deletion
 */
export function extractAvatarFileName(avatarUrl: string, bucketName: string = 'avatars'): string | null {
  try {
    const url = new URL(avatarUrl)
    const pathSegments = url.pathname.split('/')
    const bucketIndex = pathSegments.indexOf(bucketName)

    if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
      return pathSegments.slice(bucketIndex + 1).join('/')
    }

    return null
  } catch (error) {
    console.error('Error extracting filename from avatar URL:', error)
    return null
  }
}

/**
 * Get optimized avatar URL with transformations
 */
export function getOptimizedAvatarUrl(
  avatarUrl: string,
  size: number = 150,
  quality: number = 80
): string {
  try {
    const url = new URL(avatarUrl)
    const params = new URLSearchParams()

    params.append('width', size.toString())
    params.append('height', size.toString())
    params.append('quality', quality.toString())
    params.append('format', 'webp')

    url.search = params.toString()
    return url.toString()
  } catch (error) {
    console.error('Error generating optimized avatar URL:', error)
    return avatarUrl // Return original URL if optimization fails
  }
}