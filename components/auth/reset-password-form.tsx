'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { useAuth } from '@/app/lib/auth/context'
import { ResetPasswordFormData } from '@/app/types/auth'

const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const fieldVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const successVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function ResetPasswordForm() {
  const [emailSent, setEmailSent] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const { resetPassword, loading } = useAuth()
  const shouldReduceMotion = useReducedMotion()

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ResetPasswordFormData) => {
    const { error } = await resetPassword(data.email)
    if (error) {
      form.setError('root', { message: error.message })
    } else {
      setSubmittedEmail(data.email)
      setEmailSent(true)
    }
  }

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: formVariants,
      }

  const fieldMotionProps = shouldReduceMotion
    ? {}
    : {
        variants: fieldVariants,
      }

  const successMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: successVariants,
      }

  if (emailSent) {
    return (
      <motion.div {...successMotionProps} className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Check your email
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            We've sent a password reset link to{' '}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {submittedEmail}
            </span>
          </p>
        </div>

        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
          <p>
            Click the link in the email to reset your password.
            The link will expire in 1 hour.
          </p>
          <p>
            Didn't receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setEmailSent(false)}
              className="text-primary dark:text-blue-400 hover:text-primary dark:hover:text-blue-300 hover:underline transition-colors font-medium"
            >
              try again
            </button>
          </p>
        </div>

        <Link href="/login">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Button>
        </Link>
      </motion.div>
    )
  }

  return (
    <Form {...form}>
      <motion.form
        {...motionProps}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <motion.div {...fieldMotionProps} className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary/10 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-primary dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </motion.div>

        <motion.div {...fieldMotionProps}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                    disabled={loading}
                  />
                </FormControl>
                <FormDescription>
                  We'll send reset instructions to this email address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {form.formState.errors.root && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 text-sm text-destructive dark:text-red-400 bg-destructive/5 dark:bg-red-900/20 border border-destructive/20 dark:border-red-800 rounded-md"
          >
            {form.formState.errors.root.message}
          </motion.div>
        )}

        <motion.div {...fieldMotionProps} className="space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending reset link...
              </>
            ) : (
              'Send reset link'
            )}
          </Button>

          <Link href="/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
        </motion.div>
      </motion.form>
    </Form>
  )
}