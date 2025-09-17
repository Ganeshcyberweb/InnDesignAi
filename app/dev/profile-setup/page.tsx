'use client'

import { motion } from 'framer-motion'
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

export default function ProfileSetupPreviewPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 border border-slate-200 dark:border-slate-800">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Profile Setup Form Preview
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Test the ProfileSetupForm component with animations
            </p>
          </motion.div>

          <ProfileSetupForm />
        </div>
      </motion.div>
    </div>
  )
}