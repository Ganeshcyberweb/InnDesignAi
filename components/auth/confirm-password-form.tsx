'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff, Loader2, KeyRound, CheckCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { useAuth } from '@/app/lib/auth/context'
import { ConfirmPasswordFormData } from '@/app/types/auth'

const confirmPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'Password must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'Password must contain at least one uppercase letter')
    .regex(/(?=.*\d)/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
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

interface ConfirmPasswordFormProps {
  token?: string
}

export function ConfirmPasswordForm({ token }: ConfirmPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const { updatePassword, loading } = useAuth()
  const shouldReduceMotion = useReducedMotion()

  const form = useForm<ConfirmPasswordFormData>({
    resolver: zodResolver(confirmPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: ConfirmPasswordFormData) => {
    const { error } = await updatePassword(data.password, token)
    if (error) {
      form.setError('root', { message: error.message })
    } else {
      setSuccess(true)
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

  if (success) {
    return (
      <motion.div {...successMotionProps} className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Password updated successfully
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Your password has been updated. You can now sign in with your new password.
          </p>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-500">
          You will be redirected to the login page shortly...
        </p>
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
              <KeyRound className="w-6 h-6 text-primary dark:text-blue-400" />
            </div>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Enter your new password below
          </p>
        </motion.div>

        <motion.div {...fieldMotionProps}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormDescription>
                  Must be at least 8 characters with uppercase, lowercase, and number
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div {...fieldMotionProps}>
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your new password"
                      className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
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

        <motion.div {...fieldMotionProps}>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating password...
              </>
            ) : (
              'Update password'
            )}
          </Button>
        </motion.div>
      </motion.form>
    </Form>
  )
}