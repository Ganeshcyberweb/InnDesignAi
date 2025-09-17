'use client'

import { motion } from 'framer-motion'
import { Palette, ArrowRight, Sparkles, Users, Shield } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { useUser } from '@/app/lib/auth/context'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

export default function Home() {
  const user = useUser()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16 pt-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-16"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="bg-primary p-4 rounded-2xl">
                <Palette className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold text-foreground">
              InnDesign
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your spaces with AI-powered interior design. Create stunning room designs,
              get personalized recommendations, and visualize your dream spaces.
            </p>
          </motion.div>

          {/* Auth Actions */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="text-lg px-8 py-6">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-8">
              Why Choose InnDesign?
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-primary dark:text-blue-400" />
                  </div>
                  <CardTitle>AI-Powered Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Generate stunning interior designs using cutting-edge AI technology tailored to your preferences and space.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle>Professional Network</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Connect with professional designers and get expert advice to bring your vision to life.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-primary dark:text-green-400" />
                  </div>
                  <CardTitle>Secure & Private</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Your designs and personal information are protected with enterprise-grade security and privacy.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
