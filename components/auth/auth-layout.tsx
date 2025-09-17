'use client'

import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Card } from '@/components/ui/card'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  showLogo?: boolean
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1,
    },
  },
}

const logoVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export function AuthLayout({
  children,
  title,
  subtitle,
  showLogo = true,
}: AuthLayoutProps) {
  const shouldReduceMotion = useReducedMotion()

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: containerVariants,
      }

  const childMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: childVariants,
      }

  const logoMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: logoVariants,
      }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <motion.div
        {...motionProps}
        className="w-full max-w-md space-y-8"
      >
        {showLogo && (
          <motion.div {...logoMotionProps} className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              InnDesign
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              AI-Powered Interior Design
            </p>
          </motion.div>
        )}

        <Card className="p-8 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <motion.div {...childMotionProps} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {subtitle}
                </p>
              )}
            </div>
            {children}
          </motion.div>
        </Card>

        <motion.div
          {...childMotionProps}
          className="text-center text-xs text-slate-500 dark:text-slate-500"
        >
          <p>
            By continuing, you agree to our{' '}
            <a
              href="/terms"
              className="underline hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="underline hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}