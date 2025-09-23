'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

import { fadeIn, fadeInUp, tapVariant, transitions } from '@/lib/animations'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { useAuth } from '@/lib/auth/context'
import { LoginFormData } from '@/types/auth'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

const formVariants = fadeIn;
const fieldVariants = fadeInUp;
const buttonVariants = { ...fadeInUp, ...tapVariant };

const formTransition = {
  staggerChildren: 0.1,
  type: "tween" as const
}

const fieldTransition = {
  duration: 0.3,
  type: "tween" as const,
  ease: [0.22, 1, 0.36, 1]
}

const buttonTransition = {
  duration: 0.3,
  type: "tween" as const,
  ease: [0.22, 1, 0.36, 1],
  delay: 0.2
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const { signIn, loading } = useAuth()
  const shouldReduceMotion = useReducedMotion()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    const { error } = await signIn(data.email, data.password)
    if (error) {
      form.setError('root', { message: error.message })
    }
  }

  const motionProps: { [key: string]: any } = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: formVariants,
        transition: formTransition
      }

  const fieldMotionProps: { [key: string]: any } = shouldReduceMotion
    ? {}
    : {
        variants: fieldVariants,
        transition: fieldTransition
      }

  const buttonMotionProps = shouldReduceMotion
    ? {}
    : {
        variants: buttonVariants,
        whileTap: 'tap',
      }

  return (
    <Form {...form}>
      <motion.form
        {...motionProps}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <motion.div {...fieldMotionProps}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter your email"
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                    disabled={loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        <motion.div {...fieldMotionProps}>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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

        <div className="flex items-center justify-between text-sm">
          <Link
            href="/reset-password"
            className="text-primary dark:text-blue-400 hover:text-primary dark:hover:text-blue-300 hover:underline transition-colors"
          >
            Forgot your password?
          </Link>
        </div>

        <motion.div {...buttonMotionProps}>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </motion.div>

        <OAuthButtons disabled={loading} />

        <motion.div
          {...fieldMotionProps}
          className="text-center text-sm text-slate-600 dark:text-slate-400"
        >
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="text-primary dark:text-blue-400 hover:text-primary dark:hover:text-blue-300 hover:underline transition-colors font-medium"
          >
            Sign up
          </Link>
        </motion.div>
      </motion.form>
    </Form>
  )
}