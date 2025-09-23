'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import Link from 'next/link'

import { AuthButton } from '@/components/auth/auth-button'

export function Navigation() {
  const shouldReduceMotion = useReducedMotion()

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: fadeInUp,
      }

  return (
    <motion.nav
      {...motionProps}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-xl font-bold text-slate-900 dark:text-slate-100">
              InnDesign
            </span>
          </Link>

          <AuthButton />
        </div>
      </div>
    </motion.nav>
  )
}