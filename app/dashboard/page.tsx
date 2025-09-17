'use client'

import { motion } from 'framer-motion'
import { Loader2, Palette } from 'lucide-react'

import { useRequireAuth } from '@/app/lib/auth/context'
import { Sidebar, MobileHeader, DesignStudio, ROICalculator, SuggestedItems } from '@/components/dashboard'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const contentVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function DashboardPage() {
  const { user, loading } = useRequireAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // The useRequireAuth hook will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Sidebar - Hidden on mobile */}
      <Sidebar />

      {/* Main Content */}
      <div className="lg:pl-72">
        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="p-6 lg:p-8"
        >
          {/* Three Column Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-full">
            {/* Column 1: Design Studio - Takes up most space */}
            <motion.div variants={contentVariants} className="xl:col-span-8">
              <DesignStudio />
            </motion.div>

            {/* Column 2: Right sidebar - ROI Calculator and Suggested Items stacked */}
            <motion.div variants={contentVariants} className="xl:col-span-4 space-y-8">
              <ROICalculator />
              <SuggestedItems />
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  )
}