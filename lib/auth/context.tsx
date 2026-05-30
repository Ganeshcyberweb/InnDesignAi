'use client'

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContextType, AuthUser, GuestState, UserRole } from '@/types/auth'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [guest, setGuest] = useState<GuestState | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  // Create the browser client exactly once. Recreating it on every render
  // spawns fresh clients whose session hasn't restored yet, so getUser() races
  // and can transiently return null — which surfaced as being "logged out" when
  // navigating to public pages.
  const supabase = useMemo(() => createClient(), [])

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
                  role: 'USER' as UserRole,
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

  const refreshGuest = useCallback(async () => {
    try {
      const res = await fetch('/api/guest/me', { credentials: 'include' })
      if (!res.ok) {
        setGuest(null)
        return
      }
      const data = await res.json()
      setGuest(data?.guest ?? null)
    } catch (error) {
      console.error('Error refreshing guest session:', error)
      setGuest(null)
    }
  }, [])

  const startGuestSession = useCallback(async () => {
    try {
      const res = await fetch('/api/guest/start', {
        method: 'POST',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok || !data?.success) {
        return { error: new Error(data?.error || 'Failed to start guest session') }
      }
      setGuest(data.guest)
      return { error: null }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start guest session'
      return { error: new Error(message) }
    }
  }, [])

  const setGuestPromptsRemaining = useCallback((remaining: number) => {
    setGuest((prev) => {
      if (!prev) return prev
      const capped = Math.max(0, Math.min(prev.promptLimit, remaining))
      return {
        ...prev,
        promptsRemaining: capped,
        promptCount: prev.promptLimit - capped,
      }
    })
  }, [])

  useEffect(() => {
    // Initial load: resolve auth user, then (if there's no user) check for a
    // guest session. Both states need to settle before children should rely on
    // them, but the guest fetch is cheap.
    let cancelled = false
    ;(async () => {
      await refreshUser()
      if (!cancelled) await refreshGuest()
    })()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN') {
          refreshUser()
          // Signing in supersedes any guest session.
          setGuest(null)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          refreshGuest()
        }
      }
    )

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [supabase.auth, refreshUser, refreshGuest])

  const signUp = async (
    email: string,
    password: string,
    name: string,
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
    guest,
    isGuest: !user && !!guest,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    resendConfirmation,
    refreshUser,
    refreshGuest,
    startGuestSession,
    setGuestPromptsRemaining,
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