/**
 * Database utilities for Prisma integration with Supabase Auth
 * Handles user profile creation and management
 */

import { PrismaClient, UserRole } from '@/lib/generated/prisma'
import type { User } from '@supabase/supabase-js'

// Singleton Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

/**
 * Create a user profile in the database when a new user signs up
 */
export async function createUserProfile(user: User, additionalData?: {
  name?: string
  company?: string
  role?: UserRole
}) {
  try {
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        name: additionalData?.name || user.user_metadata?.name || user.email?.split('@')[0] || null,
        company: additionalData?.company || user.user_metadata?.company || null,
        role: additionalData?.role || UserRole.CLIENT,
        avatar: user.user_metadata?.avatar_url || null,
      },
    })

    return { profile, error: null }
  } catch (error) {
    console.error('Error creating user profile:', error)
    return { profile: null, error }
  }
}

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        designs: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return { profile, error: null }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return { profile: null, error }
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string
    company?: string
    role?: UserRole
    avatar?: string
  }
) {
  try {
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    })

    return { profile, error: null }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { profile: null, error }
  }
}

/**
 * Delete user profile and all associated data
 */
export async function deleteUserProfile(userId: string) {
  try {
    // Prisma will handle cascading deletes based on the schema relationships
    await prisma.profile.delete({
      where: { userId },
    })

    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting user profile:', error)
    return { success: false, error }
  }
}

/**
 * Check if user profile exists
 */
export async function profileExists(userId: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      select: { id: true },
    })

    return { exists: !!profile, error: null }
  } catch (error) {
    console.error('Error checking profile existence:', error)
    return { exists: false, error }
  }
}

/**
 * Get or create user profile - useful for auth callbacks
 */
export async function getOrCreateUserProfile(user: User, additionalData?: {
  name?: string
  company?: string
  role?: UserRole
}) {
  try {
    // First try to get existing profile
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    })

    if (existingProfile) {
      return { profile: existingProfile, error: null, created: false }
    }

    // Create new profile if doesn't exist
    const { profile, error } = await createUserProfile(user, additionalData)

    return { profile, error, created: true }
  } catch (error) {
    console.error('Error getting or creating user profile:', error)
    return { profile: null, error, created: false }
  }
}

/**
 * Database health check
 */
export async function healthCheck() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return { healthy: true, error: null }
  } catch (error) {
    console.error('Database health check failed:', error)
    return { healthy: false, error }
  }
}

/**
 * Gracefully disconnect Prisma client
 */
export async function disconnect() {
  await prisma.$disconnect()
}