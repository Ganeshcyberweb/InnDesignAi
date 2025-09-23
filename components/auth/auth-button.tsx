'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { LogIn, UserPlus } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/context'
import { UserMenu } from './user-menu'
import { scaleIn, transitions, tapVariant } from '@/lib/animations'

const buttonVariants = {
  ...scaleIn,
  ...tapVariant
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export function AuthButton() {
  const { user, loading } = useAuth()
  const shouldReduceMotion = useReducedMotion()

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: containerVariants,
      }

  const buttonMotionProps = shouldReduceMotion
    ? {}
    : {
        variants: buttonVariants,
        initial: "hidden",
        animate: "visible",
        whileTap: "tap",
        transition: transitions.default
      }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="h-9 w-16 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
        <div className="h-9 w-16 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse" />
      </div>
    )
  }

  // Show user menu if authenticated
  if (user) {
    return <UserMenu />
  }

  // Show login/signup buttons if not authenticated
  return (
    <motion.div {...motionProps} className="flex items-center space-x-2">
      <motion.div {...buttonMotionProps}>
        <Link href="/login">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Sign in
          </Button>
        </Link>
      </motion.div>

      <motion.div {...buttonMotionProps}>
        <Link href="/signup">
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Sign up
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}