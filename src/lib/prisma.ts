import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

declare global {
  var __prisma: PrismaClient | undefined
}

/**
 * Singleton Prisma Client instance for database operations
 * Prevents multiple instances in development due to hot reloading
 */
export const prisma =
  globalThis.__prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}

/**
 * Graceful disconnect function for cleanup
 */
export async function disconnectPrisma() {
  await prisma.$disconnect()
}

/**
 * Health check for database connection
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

/**
 * Error handling utilities for Prisma operations
 */
export class DatabaseError extends Error {
  public code?: string
  public meta?: any

  constructor(error: PrismaClientKnownRequestError) {
    super(error.message)
    this.name = 'DatabaseError'
    this.code = error.code
    this.meta = error.meta
  }
}

/**
 * Helper function to handle Prisma errors consistently
 */
export function handlePrismaError(error: unknown): never {
  if (error instanceof PrismaClientKnownRequestError) {
    throw new DatabaseError(error)
  }
  throw error
}

/**
 * Transaction wrapper for complex operations
 */
export async function withTransaction<T>(
  operation: (prisma: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(operation, {
    maxWait: 10000, // 10s maximum wait time
    timeout: 30000, // 30s timeout
  })
}

// Re-export types from the generated Prisma client
export type {
  Profile,
  Preferences,
  Design,
  DesignOutput,
  RoiCalculation,
  Feedback,
} from '../generated/prisma'

// Re-export enum types
export {
  UserRole,
  DesignStatus,
  FeedbackType,
} from '../generated/prisma'