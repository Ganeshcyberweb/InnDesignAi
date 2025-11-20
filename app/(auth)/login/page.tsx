"use client";

import { AuthLayout } from '@/components/auth/auth-layout'
import { LoginForm } from '@/components/auth/login-form'
import { usePendingDesignStore } from '@/stores/pending-design-store'
import { Info } from 'lucide-react'

export default function LoginPage() {
  const { hasPendingDesign } = usePendingDesignStore()

  return (
    <AuthLayout
      title="Welcome back"
      subtitle={
        hasPendingDesign
          ? "Sign in to continue your design"
          : "Sign in to your account to continue"
      }
    >
      {hasPendingDesign && (
        <div className="mb-4 flex items-start gap-3 rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-primary">
            Your design preferences have been saved. Complete your login to continue generating your design.
          </p>
        </div>
      )}
      <LoginForm />
    </AuthLayout>
  )
}