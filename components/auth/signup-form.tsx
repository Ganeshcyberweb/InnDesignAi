'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, useReducedMotion } from 'framer-motion'
import { Eye, EyeOff, Loader2, Building2, Palette, Shield } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { OAuthButtons } from '@/components/auth/oauth-buttons'
import { useAuth } from '@/app/lib/auth/context'
import { SignupFormData, UserRole } from '@/app/types/auth'

const signupSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
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
  role: z.enum(['CLIENT', 'DESIGNER'], {
    required_error: 'Please select your role',
  }),
  company: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine((data) => {
  if (data.role === 'DESIGNER' && (!data.company || data.company.trim().length === 0)) {
    return false
  }
  return true
}, {
  message: 'Company name is required for designers',
  path: ['company'],
})

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3,
    },
  },
  tap: {
    scale: 0.98,
  },
}

const roleOptions = [
  {
    value: 'CLIENT' as UserRole,
    label: 'Client',
    description: 'I want to design my space',
    icon: Building2,
  },
  {
    value: 'DESIGNER' as UserRole,
    label: 'Designer',
    description: 'I want to help others with design',
    icon: Palette,
  },
]

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signUp, loading } = useAuth()
  const shouldReduceMotion = useReducedMotion()

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
    },
  })

  const watchedRole = form.watch('role')

  const onSubmit = async (data: SignupFormData) => {
    const { error } = await signUp(
      data.email,
      data.password,
      data.name,
      data.role,
      data.company
    )
    if (error) {
      form.setError('root', { message: error.message })
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your full name"
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
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>I am a...</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                  <FormControl>
                    <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roleOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-3">
                            <Icon className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {option.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>

        {watchedRole === 'DESIGNER' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company/Studio Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your company or studio name"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be displayed on your designer profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
        )}

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
                      placeholder="Create a strong password"
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
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
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

        <motion.div {...buttonMotionProps}>
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Create account'
            )}
          </Button>
        </motion.div>

        <OAuthButtons disabled={loading} />

        <motion.div
          {...fieldMotionProps}
          className="text-center text-sm text-slate-600 dark:text-slate-400"
        >
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary dark:text-blue-400 hover:text-primary dark:hover:text-blue-300 hover:underline transition-colors font-medium"
          >
            Sign in
          </Link>
        </motion.div>
      </motion.form>
    </Form>
  )
}