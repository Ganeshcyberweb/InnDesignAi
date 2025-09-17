import { Suspense } from 'react'
import { AuthLayout } from '@/components/auth/auth-layout'
import { ConfirmPasswordForm } from '@/components/auth/confirm-password-form'

export const metadata = {
  title: 'Confirm New Password | InnDesign',
  description: 'Set your new password for your InnDesign account.',
}

function ConfirmPasswordContent() {
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const token = searchParams.get('token')

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Enter your new password below"
    >
      <ConfirmPasswordForm token={token || undefined} />
    </AuthLayout>
  )
}

export default function ConfirmPasswordPage() {
  return (
    <Suspense fallback={
      <AuthLayout
        title="Set new password"
        subtitle="Loading..."
      >
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AuthLayout>
    }>
      <ConfirmPasswordContent />
    </Suspense>
  )
}