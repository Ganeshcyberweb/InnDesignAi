/**
 * Example integration code for the Profile Setup API
 * This file demonstrates how to use the /api/profile/setup endpoint from the frontend
 */

// Types for the API request and response
export interface ProfileSetupRequest {
  name: string
  role: 'CLIENT' | 'DESIGNER' | 'ADMIN'
  company?: string
  avatar?: File
}

export interface ProfileSetupResponse {
  success: boolean
  data?: {
    profile: {
      id: string
      userId: string
      name: string
      company: string | null
      role: string
      avatar: string | null
      createdAt: string
      updatedAt: string
      designs?: any[]
    }
  }
  message?: string
  error?: string
  errors?: Record<string, string>
  code?: string
}

/**
 * Submit profile setup data to the API
 */
export async function submitProfileSetup(
  data: ProfileSetupRequest
): Promise<ProfileSetupResponse> {
  try {
    // Create FormData object
    const formData = new FormData()
    formData.append('name', data.name.trim())
    formData.append('role', data.role)

    // Add company if provided (required for DESIGNER role)
    if (data.company) {
      formData.append('company', data.company.trim())
    }

    // Add avatar file if provided
    if (data.avatar) {
      formData.append('avatar', data.avatar)
    }

    // Submit to API
    const response = await fetch('/api/profile/setup', {
      method: 'POST',
      body: formData,
      // Note: Don't set Content-Type header - let browser set it with boundary
    })

    const result: ProfileSetupResponse = await response.json()

    // Return the parsed response
    return result

  } catch (error) {
    console.error('Profile setup submission error:', error)
    return {
      success: false,
      error: 'Network error occurred. Please try again.',
      code: 'NETWORK_ERROR'
    }
  }
}

/**
 * Validate avatar file before submission
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  const maxSizeBytes = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  // Check file size
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: 'Avatar file must be less than 5MB'
    }
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Avatar must be a JPEG, PNG, or WebP image'
    }
  }

  return { valid: true }
}

/**
 * React hook example for profile setup
 */
import { useState, useCallback } from 'react'

export function useProfileSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const setupProfile = useCallback(async (data: ProfileSetupRequest) => {
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    try {
      // Validate avatar file if provided
      if (data.avatar) {
        const avatarValidation = validateAvatarFile(data.avatar)
        if (!avatarValidation.valid) {
          setError(avatarValidation.error!)
          setIsLoading(false)
          return { success: false }
        }
      }

      // Submit to API
      const result = await submitProfileSetup(data)

      if (result.success) {
        // Success - profile setup completed
        return { success: true, profile: result.data?.profile }
      } else {
        // Handle errors
        if (result.errors) {
          setFieldErrors(result.errors)
        } else {
          setError(result.error || 'Profile setup failed')
        }
        return { success: false }
      }

    } catch (error) {
      setError('An unexpected error occurred')
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    setupProfile,
    isLoading,
    error,
    fieldErrors,
    clearErrors: () => {
      setError(null)
      setFieldErrors({})
    }
  }
}

/**
 * Example React component using the profile setup API
 */
import React, { useState } from 'react'

export function ProfileSetupForm() {
  const { setupProfile, isLoading, error, fieldErrors, clearErrors } = useProfileSetup()
  const [formData, setFormData] = useState<ProfileSetupRequest>({
    name: '',
    role: 'CLIENT',
    company: '',
    avatar: undefined
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearErrors()

    const result = await setupProfile(formData)

    if (result.success) {
      // Redirect to dashboard or next step
      window.location.href = '/dashboard'
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFormData(prev => ({ ...prev, avatar: file }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full Name *
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={`mt-1 block w-full rounded-md border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'}`}
          required
        />
        {fieldErrors.name && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
        )}
      </div>

      {/* Role Field */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium">
          Role *
        </label>
        <select
          id="role"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({
            ...prev,
            role: e.target.value as ProfileSetupRequest['role']
          }))}
          className="mt-1 block w-full rounded-md border border-gray-300"
          required
        >
          <option value="CLIENT">Client</option>
          <option value="DESIGNER">Designer</option>
          <option value="ADMIN">Administrator</option>
        </select>
        {fieldErrors.role && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.role}</p>
        )}
      </div>

      {/* Company Field (conditional) */}
      {formData.role === 'DESIGNER' && (
        <div>
          <label htmlFor="company" className="block text-sm font-medium">
            Company Name *
          </label>
          <input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
            className={`mt-1 block w-full rounded-md border ${fieldErrors.company ? 'border-red-500' : 'border-gray-300'}`}
            required={formData.role === 'DESIGNER'}
          />
          {fieldErrors.company && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.company}</p>
          )}
        </div>
      )}

      {/* Avatar Field */}
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium">
          Avatar Image (Optional)
        </label>
        <input
          id="avatar"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleAvatarChange}
          className="mt-1 block w-full"
        />
        <p className="mt-1 text-xs text-gray-500">
          JPEG, PNG, or WebP. Max file size: 5MB
        </p>
        {fieldErrors.avatar && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.avatar}</p>
        )}
      </div>

      {/* General Error */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Setting up profile...' : 'Complete Setup'}
      </button>
    </form>
  )
}

/**
 * Example usage in a Next.js page
 */
export default function ProfileSetupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Complete Your Profile
        </h1>
        <ProfileSetupForm />
      </div>
    </div>
  )
}

/**
 * Example server-side validation for existing profile check
 */
export async function getServerSideProps(context: any) {
  // This would check if user already has a completed profile
  // and redirect them to dashboard if so

  const { user, profile } = await getAuthUser() // Your auth helper

  if (!user) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      }
    }
  }

  // If profile is already complete, redirect to dashboard
  if (profile?.name && profile?.role) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

  return {
    props: {
      user: {
        id: user.id,
        email: user.email
      }
    }
  }
}