'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import Link from 'next/link'

import { AuthLayout } from '@/components/auth/auth-layout'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/lib/auth/context'

function ConfirmEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const { resendConfirmation } = useAuth()

  useEffect(() => {
    const confirmEmail = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Invalid confirmation link. Please check your email for the correct link.')
        return
      }

      try {
        const response = await fetch('/api/auth/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage('Your email has been confirmed successfully!')
        } else {
          setStatus('error')
          setMessage(data.error || 'Email confirmation failed.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    }

    confirmEmail()
  }, [token])

  const handleResendConfirmation = async () => {
    const email = prompt('Please enter your email address:')
    if (email) {
      await resendConfirmation(email)
    }
  }

  if (status === 'loading') {
    return (
      <AuthLayout
        title="Confirming your email"
        subtitle="Please wait while we verify your email address"
      >
        <div className="flex flex-col items-center space-y-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            This should only take a moment...
          </p>
        </div>
      </AuthLayout>
    )
  }

  if (status === 'success') {
    return (
      <AuthLayout
        title="Email confirmed!"
        subtitle="Your account is now verified and ready to use"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-6"
        >
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary/10 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary dark:text-green-400" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-slate-600 dark:text-slate-400">
              {message}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-500">
              You can now sign in and start using InnDesign to transform your spaces with AI.
            </p>
          </div>

          <Link href="/login">
            <Button className="w-full">
              Sign in to your account
            </Button>
          </Link>
        </motion.div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Email confirmation failed"
      subtitle="There was a problem confirming your email address"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center space-y-6"
      >
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-destructive/10 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-destructive dark:text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-slate-600 dark:text-slate-400">
            {message}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            The link may have expired or been used already.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleResendConfirmation}
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            Resend confirmation email
          </Button>

          <Link href="/login">
            <Button variant="outline" className="w-full">
              Back to sign in
            </Button>
          </Link>
        </div>
      </motion.div>
    </AuthLayout>
  )
}


export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={
      <AuthLayout
        title="Confirming your email"
        subtitle="Please wait..."
      >
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AuthLayout>
    }>
      <ConfirmEmailContent />
    </Suspense>
  )
}