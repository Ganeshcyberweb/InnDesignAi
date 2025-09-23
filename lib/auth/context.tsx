'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContextType, AuthUser, UserRole } from '@/types/auth'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const refreshUser = useCallback(async () => {
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()

      if (error || !authUser) {
        setUser(null)
        setLoading(false)
        return
      }

      // Get profile data from your database
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        // If profile doesn't exist, create a basic user object from auth data
        // For OAuth users, wait a moment and try again as the trigger might be creating the profile
        if (authUser.app_metadata?.provider && authUser.app_metadata.provider !== 'email') {
          setTimeout(async () => {
            const retryResponse = await fetch('/api/auth/me', {
              credentials: 'include',
            })

            if (retryResponse.ok) {
              const retryUserData = await retryResponse.json()
              setUser(retryUserData)
            } else {
              // If still no profile, create temporary user object
              setUser({
                id: authUser.id,
                email: authUser.email || '',
                email_verified: authUser.email_confirmed_at !== null,
                created_at: authUser.created_at,
                updated_at: authUser.updated_at || authUser.created_at,
                profile: {
                  id: `temp-${authUser.id}`,
                  user_id: authUser.id,
                  name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
                  company: null,
                  role: 'CLIENT' as UserRole,
                  avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
                  created_at: authUser.created_at,
                  updated_at: authUser.updated_at || authUser.created_at,
                }
              })
            }
          }, 2000) // Wait 2 seconds for trigger to create profile
        }

        // Set temporary user object immediately
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          email_verified: authUser.email_confirmed_at !== null,
          created_at: authUser.created_at,
          updated_at: authUser.updated_at || authUser.created_at,
          profile: {
            id: `temp-${authUser.id}`,
            user_id: authUser.id,
            name: authUser.user_metadata?.name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
            company: null,
            role: 'CLIENT' as UserRole,
            avatar_url: authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture || null,
            created_at: authUser.created_at,
            updated_at: authUser.updated_at || authUser.created_at,
          }
        })
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    refreshUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN') {
          refreshUser()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, refreshUser])

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    company?: string
  ) => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name,
          role,
          company,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        return { data: null, error: new Error(data.error || 'Sign up failed') }
      }

      toast.success('Account created! Please check your email to confirm your account.')
      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed'
      return { data: null, error: new Error(errorMessage) }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        return { data: null, error: new Error(data.error || 'Sign in failed') }
      }

      setUser(data.user)
      toast.success('Successfully signed in!')
      router.push('/dashboard')
      return { data, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed'
      return { data: null, error: new Error(errorMessage) }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        return { error }
      }

      setUser(null)
      toast.success('Successfully signed out!')
      router.push('/login')
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed'
      return { error: new Error(errorMessage) }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: new Error(data.error || 'Password reset failed') }
      }

      toast.success('Password reset email sent! Check your inbox.')
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed'
      return { error: new Error(errorMessage) }
    }
  }

  const updatePassword = async (password: string, token?: string) => {
    try {
      const response = await fetch('/api/auth/reset-password/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password, token }),
        credentials: 'include',
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: new Error(data.error || 'Password update failed') }
      }

      toast.success('Password updated successfully!')
      router.push('/login')
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password update failed'
      return { error: new Error(errorMessage) }
    }
  }

  const resendConfirmation = async (email: string) => {
    try {
      const response = await fetch('/api/auth/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: new Error(data.error || 'Confirmation email failed') }
      }

      toast.success('Confirmation email sent! Check your inbox.')
      return { error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Confirmation email failed'
      return { error: new Error(errorMessage) }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useUser() {
  const { user } = useAuth()
  return user
}

export function useRequireAuth(redirectTo = '/login') {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo)
    }
  }, [user, loading, redirectTo, router])

  return { user, loading }
}