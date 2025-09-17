import { AuthLayout } from '@/components/auth/auth-layout'
import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Sign In | InnDesign',
  description: 'Sign in to your InnDesign account to access AI-powered interior design tools.',
}

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      <LoginForm />
    </AuthLayout>
  )
}