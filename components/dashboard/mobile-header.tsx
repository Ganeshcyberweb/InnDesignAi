'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Palette,
  Home,
  History,
  Bookmark,
  Settings,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserMenu } from '@/components/auth/user-menu'
import { useAuth } from '@/app/lib/auth/context'

const mobileMenuVariants = {
  hidden: { opacity: 0, x: '-100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    x: '-100%',
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const itemVariants = {
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

export function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  if (!user) return null

  const profile = user.profile
  const displayName = profile?.name || user.email?.split('@')[0] || 'User'
  const avatarFallback = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Palette className="h-5 w-5 text-black" />
            </div>
            <h1 className="text-lg font-semibold text-foreground">
              InnDesign AI
            </h1>
          </div>
          <UserMenu />
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.aside
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-y-0 left-0 z-50 w-72 bg-black border-r border-black/20 flex flex-col lg:hidden"
            >
              {/* Close Button & Logo */}
              <motion.div variants={itemVariants} className="flex items-center justify-between p-6 border-b border-black/20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <Palette className="h-5 w-5 text-black" />
                  </div>
                  <h1 className="text-lg font-semibold text-white">InnDesign AI</h1>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-white hover:bg-black/60"
                >
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <motion.div key={item.name} variants={itemVariants}>
                      <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant={item.current ? 'secondary' : 'ghost'}
                          className={`w-full justify-start h-11 text-left ${
                            item.current
                              ? 'bg-black/80 text-white hover:bg-black/70'
                              : 'text-white/60 hover:text-white hover:bg-black/60'
                          }`}
                        >
                          <Icon className="mr-3 h-5 w-5" />
                          {item.name}
                        </Button>
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
                </div>
              </motion.div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}