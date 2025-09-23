'use client'

import { motion, Variants } from 'framer-motion'
import { cubicBezier } from 'framer-motion'
import { useState } from 'react'
import {
  Home,
  History,
  Bookmark,
  Settings,
  Palette,
  User,
  CreditCard,
  Menu,
  X
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { UserMenu } from '@/components/auth/user-menu'
import { useAuth } from '@/lib/auth/context'

const sidebarVariants: Variants = {
  hidden: { x: -280, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
    },
  },
}

const itemVariants: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
}

export function Sidebar() {
  const { user } = useAuth()
  const pathname = usePathname()

  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: pathname === '/dashboard',
    },
    {
      name: 'History',
      href: '/dashboard/history',
      icon: History,
      current: pathname === '/dashboard/history',
    },
    {
      name: 'Saved Projects',
      href: '/dashboard/saved',
      icon: Bookmark,
      current: pathname === '/dashboard/saved',
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: pathname === '/dashboard/settings',
    },
  ]

  if (!user) {
    return null
  }

  const profile = user.profile
  const displayName = profile?.name || user.email?.split('@')[0] || 'User'
  const avatarFallback = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-black/20 hidden lg:flex flex-col"
    >
      {/* Logo */}
      <motion.div variants={itemVariants} className="flex items-center space-x-3 p-6 border-b border-black/20">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <Palette className="h-5 w-5 text-black" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-white">InnDesign AI</h1>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <motion.div key={item.name} variants={itemVariants}>
              <Link href={item.href}>
                <div
                  className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-colors ${
                    item.current
                      ? 'bg-black/80 text-white'
                      : 'text-white/60 hover:text-white hover:bg-black/60'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* User Profile */}
      <motion.div
        variants={itemVariants}
        className="border-t border-black/20 p-4"
      >
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={profile?.avatar_url || ''}
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-white text-black font-medium">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {displayName}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-white/60">155 credits left</span>
            </div>
          </div>
          <div className="relative">
            <UserMenu />
          </div>
        </div>
      </motion.div>
    </motion.aside>
  )
}