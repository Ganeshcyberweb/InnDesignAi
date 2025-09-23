'use client'

import { motion } from 'framer-motion'
import { Palette, ArrowRight, Sparkles, Users, Shield } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useUser } from '@/lib/auth/context'
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import UserDropdown from "@/components/user-dropdown";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
} as any

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
} as any

export default function Home() {
  const user = useUser()

  return (
    <div className="flex h-[calc(100svh-4rem)] bg-[hsl(240_5%_92.16%)] md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
          <div className="flex-1 w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
            <div className="h-full flex flex-col px-4 md:px-6 lg:px-8 py-12">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center space-y-16 max-w-4xl mx-auto"
              >
                {/* Hero Section */}
                <motion.div variants={itemVariants} className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="bg-primary p-4 rounded-2xl">
                      <Palette className="h-12 w-12 text-black" />
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
              </motion.div>
            </div>
          </div>
        </div>
  )
}
