import { AuthLayout } from '@/components/auth/auth-layout'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata = {
  title: 'Reset Password | InnDesign',
  description: 'Reset your InnDesign account password.',
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send you a link to reset your password"
    >
      <ResetPasswordForm />
    </AuthLayout>
  )
}