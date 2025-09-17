import { AuthLayout } from '@/components/auth/auth-layout'
import { SignupForm } from '@/components/auth/signup-form'

export const metadata = {
  title: 'Sign Up | InnDesign',
  description: 'Create your InnDesign account to start transforming your spaces with AI-powered design tools.',
}

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of users transforming their spaces with AI"
    >
      <SignupForm />
    </AuthLayout>
  )
}