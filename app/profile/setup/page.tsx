'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

import { useRequireAuth } from '@/app/lib/auth/context'
import { ProfileSetupForm } from '@/components/profile/ProfileSetupForm'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function ProfileSetupPage() {
  const { user, loading } = useRequireAuth()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === 'true'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // useRequireAuth will redirect to login
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-800">
          {isWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Welcome to InnDesign!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Let's set up your profile to get started
              </p>
            </motion.div>
          )}

          {!isWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-6"
            >
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Complete Your Profile
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Please complete your profile setup to continue
              </p>
            </motion.div>
          )}

          <ProfileSetupForm />
        </div>
      </motion.div>
    </div>
  )
}