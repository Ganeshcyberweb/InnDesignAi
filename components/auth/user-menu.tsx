'use client'

import { motion, useReducedMotion, easeInOut } from 'framer-motion'
import {
  User,
  Settings,
  LogOut,
  Palette,
  Building2,
  Shield,
  ChevronDown,
  Bell,
  HelpCircle
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/context'

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: easeInOut,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.1,
      ease: easeInOut,
    },
  },
}

const avatarVariants = {
  idle: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: easeInOut,
    },
  },
  tap: { scale: 0.95 },
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'DESIGNER':
      return <Palette className="h-4 w-4" />
    case 'CLIENT':
      return <Building2 className="h-4 w-4" />
    case 'ADMIN':
      return <Shield className="h-4 w-4" />
    default:
      return <User className="h-4 w-4" />
  }
}

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case 'DESIGNER':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    case 'CLIENT':
      return 'bg-primary/10 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'ADMIN':
      return 'bg-destructive/10 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    default:
      return 'bg-muted text-foreground dark:bg-background/20 dark:text-muted-foreground'
  }
}

const formatRoleTitle = (role: string) => {
  return role.charAt(0) + role.slice(1).toLowerCase()
}

export function UserMenu() {
  const { user, signOut } = useAuth()
  const shouldReduceMotion = useReducedMotion()

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

  const avatarMotionProps = shouldReduceMotion
    ? {}
    : {
        variants: avatarVariants,
        initial: 'idle',
        whileHover: 'hover',
        whileTap: 'tap',
      }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
        >
          <motion.div {...avatarMotionProps}>
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={profile?.avatar_url || ''}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <ChevronDown className="absolute -bottom-0.5 -right-0.5 h-3 w-3 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64"
        align="end"
        forceMount
        asChild
      >
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={shouldReduceMotion ? {} : dropdownVariants}
        >
          <div>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url || ''} alt={displayName} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">
                      {displayName}
                    </p>
                    <p className="text-xs leading-none text-slate-500 dark:text-slate-400 truncate max-w-32">
                      {user.email}
                    </p>
                  </div>
                </div>

                {profile?.role && (
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(profile.role)}`}>
                      {getRoleIcon(profile.role)}
                      <span>{formatRoleTitle(profile.role)}</span>
                    </span>
                    {profile.company && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-20">
                        {profile.company}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer hover:bg-destructive/5 dark:hover:bg-red-900/20 transition-colors focus:bg-destructive/5 dark:focus:bg-red-900/20"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4 text-destructive dark:text-red-400" />
              <span className="text-destructive dark:text-red-400">Sign out</span>
            </DropdownMenuItem>
          </div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}