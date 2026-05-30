"use client";

import { AuthLayout } from '@/components/auth/auth-layout'
import { SignupForm } from '@/components/auth/signup-form'
import { ContinueAsGuestButton } from '@/components/auth/continue-as-guest-button'
import { usePendingDesignStore } from '@/stores/pending-design-store'
import { Info } from 'lucide-react'

export default function SignupPage() {
  const { hasPendingDesign } = usePendingDesignStore()

  return (
    <AuthLayout
      title="Create your account"
      subtitle={
        hasPendingDesign
          ? "Sign up to start generating your design"
          : "Join thousands of users transforming their spaces with AI"
      }
    >
      {hasPendingDesign && (
        <div className="mb-4 flex items-start gap-3 rounded-lg bg-primary/10 border border-primary/20 p-3 text-sm">
          <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-primary">
            Your design preferences have been saved. Create your account to continue generating your design.
          </p>
        </div>
      )}
      <SignupForm />
      <ContinueAsGuestButton />
    </AuthLayout>
  )
}