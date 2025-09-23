/**
 * Authentication Components Export
 *
 * This file exports all authentication-related components built with:
 * - ShadCN/UI for consistent design system
 * - Framer Motion for smooth animations
 * - React Hook Form + Zod for form validation
 * - Tailwind CSS for styling
 */

// Layout component for auth pages
export { AuthLayout } from './auth-layout'

// Form components with validation and animations
export { LoginForm } from './login-form'
export { SignupForm } from './signup-form'
export { ResetPasswordForm } from './reset-password-form'
export { ConfirmPasswordForm } from './confirm-password-form'

// Navigation and user interface components
export { AuthButton } from './auth-button'
export { UserMenu } from './user-menu'

// Re-export auth context and hooks for convenience
export { useAuth, useUser, useRequireAuth, AuthProvider } from '@/lib/auth/context'