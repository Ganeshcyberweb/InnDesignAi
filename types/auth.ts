import { Database } from './database'

export type UserRole = 'CLIENT' | 'DESIGNER' | 'ADMIN'

export interface User {
  id: string
  email: string
  email_verified: boolean
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  name: string | null
  company: string | null
  role: UserRole
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AuthUser extends User {
  profile?: Profile
}

export interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signUp: (email: string, password: string, name: string, role: UserRole, company?: string) => Promise<{ data: any; error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: Error | null }>
  signOut: () => Promise<{ error: Error | null }>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  updatePassword: (password: string, token?: string) => Promise<{ error: Error | null }>
  resendConfirmation: (email: string) => Promise<{ error: Error | null }>
  refreshUser: () => Promise<void>
}

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  company?: string
}

export interface ResetPasswordFormData {
  email: string
}

export interface ConfirmPasswordFormData {
  password: string
  confirmPassword: string
}

export interface AuthError {
  message: string
  field?: string
}