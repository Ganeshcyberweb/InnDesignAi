'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, useReducedMotion } from 'framer-motion'
import { Building2, Palette, Shield, Loader2, User, Camera, Upload } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserRole } from '@/app/types/auth'

const setupSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  role: z.enum(['CLIENT', 'DESIGNER', 'ADMIN'], { required_error: 'Please select your role' }),
  company: z.string().optional(),
  avatar: z.any().optional(),
}).refine((data) => {
  if (data.role === 'DESIGNER' && (!data.company || data.company.trim().length === 0)) {
    return false
  }
  return true
}, {
  message: 'Company name is required for designers',
  path: ['company'],
})

type ProfileSetupFormData = z.infer<typeof setupSchema>

const formVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.3,
    },
  },
  tap: {
    scale: 0.98,
  },
}

const roleOptions = [
  {
    value: 'CLIENT' as UserRole,
    label: 'Client',
    description: 'I want to design my space',
    icon: Building2,
  },
  {
    value: 'DESIGNER' as UserRole,
    label: 'Designer',
    description: 'I want to help others with design',
    icon: Palette,
  },
  {
    value: 'ADMIN' as UserRole,
    label: 'Administrator',
    description: 'System administrator',
    icon: Shield,
  },
]

export function ProfileSetupForm() {
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()

  const form = useForm<ProfileSetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      name: '',
      company: '',
      avatar: null,
    },
  })

  const watchedRole = form.watch('role')
  const watchedName = form.watch('name')

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB')
        return
      }

      setSelectedFile(file)
      form.setValue('avatar', file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const onSubmit = async (data: ProfileSetupFormData) => {
    setLoading(true)

    try {
      // Create FormData to handle file upload
      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('role', data.role)
      if (data.company) {
        formData.append('company', data.company)
      }
      if (selectedFile) {
        formData.append('avatar', selectedFile)
      }

      const response = await fetch('/api/profile/setup', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to setup profile')
      }

      const result = await response.json()

      // Show success notification
      toast.success('Profile setup completed successfully!', {
        description: 'Welcome to your dashboard.',
      })

      // Redirect to dashboard
      router.push('/dashboard')

    } catch (error) {
      console.error('Profile setup error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to setup profile'

      form.setError('root', {
        message: errorMessage
      })

      toast.error('Profile setup failed', {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: formVariants,
      }

  const fieldMotionProps = shouldReduceMotion
    ? {}
    : {
        variants: fieldVariants,
      }

  const buttonMotionProps = shouldReduceMotion
    ? {}
    : {
        variants: buttonVariants,
        whileTap: 'tap',
      }

  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
        animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-8"
      >
        <div className="relative mb-6">
          <motion.div
            className="relative mx-auto w-24 h-24 cursor-pointer group"
            onClick={handleAvatarClick}
            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
          >
            <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-800 shadow-lg">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Avatar preview" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-semibold">
                  {watchedName ? getInitials(watchedName) : <User className="w-8 h-8" />}
                </AvatarFallback>
              )}
            </Avatar>
            <motion.div
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              initial={false}
            >
              <Camera className="w-6 h-6 text-white" />
            </motion.div>
            <div className="absolute -bottom-1 -right-1 bg-primary/50 rounded-full p-2 border-2 border-white dark:border-slate-800 shadow-md">
              <Upload className="w-3 h-3 text-white" />
            </div>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Click to upload avatar (optional)
          </p>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Complete Your Profile
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Tell us a bit about yourself to get started
        </p>
      </motion.div>

      <Form {...form}>
        <motion.form
          {...motionProps}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <motion.div {...fieldMotionProps}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your full name"
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div {...fieldMotionProps}>
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am a...</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                    <FormControl>
                      <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map((option) => {
                        const Icon = option.icon
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-3">
                              <Icon className="h-4 w-4" />
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                  {option.description}
                                </div>
                              </div>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          {watchedRole === 'DESIGNER' && (
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, height: 'auto' }}
              exit={shouldReduceMotion ? {} : { opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company/Studio Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your company or studio name"
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormDescription>
                      This will be displayed on your designer profile
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
          )}

          {form.formState.errors.root && (
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
              className="p-3 text-sm text-destructive dark:text-red-400 bg-destructive/5 dark:bg-red-900/20 border border-destructive/20 dark:border-red-800 rounded-md"
            >
              {form.formState.errors.root.message}
            </motion.div>
          )}

          <motion.div {...buttonMotionProps}>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up profile...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          </motion.div>
        </motion.form>
      </Form>
    </div>
  )
}