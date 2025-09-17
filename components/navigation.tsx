'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Palette } from 'lucide-react'
import Link from 'next/link'

import { AuthButton } from '@/components/auth/auth-button'

const navVariants = {
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

export function Navigation() {
  const shouldReduceMotion = useReducedMotion()

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: navVariants,
      }

  return (
    <motion.nav
      {...motionProps}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl">
              <Palette className="h-6 w-6 text-white" />
            </div>
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