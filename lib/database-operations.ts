/**
 * Database operations for InnDesign AI - Interior Design Platform
 * Comprehensive utility functions for design workflow operations
 */

import { prisma, handlePrismaError, withTransaction } from './prisma'
import type {
  Profile,
  Design,
  DesignOutput,
  UserRole,
  DesignStatus,
} from './generated/prisma'

import type { GenerationParameters } from '@/types/design'
import type { CostBreakdown } from '@/types/roi'

// ================================
// Type Definitions
// ================================

export interface CreateDesignRequest {
  userId: string
  title?: string
  description?: string
  style?: string
  mood?: string
  colorPalette?: any
  roomType?: string
  budget?: number
  priority?: string
  customRequirements?: string
  imageUrl?: string
  isPublic?: boolean
  status?: DesignStatus
  generationNumber?: number
  
  // Merged preferences fields
  size?: string
  stylePreference?: string
  colorScheme?: string
  materialPreferences?: string
  otherRequirements?: string
  
  // Merged ROI calculation fields
  estimatedCost?: number
  roiPercentage?: number
  paybackTimeline?: string
  costBreekdown?: any
  roiNotes?: string
}

export interface CreateDesignOutputRequest {
  designId: string
  outputImageUrl: string
  variationName?: string
  generationParameters?: GenerationParameters
}

export interface DesignWithRelations extends Design {
  profile: Profile
  outputs: DesignOutput[]
}

// ================================
// Profile Operations
// ================================

/**
 * Create or update user profile
 */
export async function upsertProfile(
  userId: string,
  data: {
    name?: string
    company?: string
    role?: UserRole
    avatar?: string
  }
): Promise<Profile> {
  try {
    return await prisma.profile.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: data,
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

/**
 * Get profile by user ID
 */
export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  try {
    return await prisma.profile.findUnique({
      where: { userId },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

// ================================
// Design Operations
// ================================

/**
 * Create a new design with all fields merged
 */
export async function createDesign(
  data: CreateDesignRequest
): Promise<DesignWithRelations> {
  try {
    const design = await prisma.design.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        style: data.style,
        mood: data.mood,
        colorPalette: data.colorPalette,
        roomType: data.roomType,
        budget: data.budget,
        priority: data.priority,
        customRequirements: data.customRequirements,
        imageUrl: data.imageUrl,
        isPublic: data.isPublic || false,
        status: data.status || 'PENDING',
        generationNumber: data.generationNumber || 1,
        
        // Merged preferences fields
        size: data.size,
        stylePreference: data.stylePreference,
        colorScheme: data.colorScheme,
        materialPreferences: data.materialPreferences,
        otherRequirements: data.otherRequirements,
        
        // Merged ROI calculation fields
        estimatedCost: data.estimatedCost,
        roiPercentage: data.roiPercentage,
        paybackTimeline: data.paybackTimeline,
        costBreakdown: data.costBreekdown,
        roiNotes: data.roiNotes,
      },
      include: {
        profile: true,
        outputs: true,
      },
    }) as DesignWithRelations

    return design
  } catch (error) {
    handlePrismaError(error)
  }
}

/**
 * Update design status
 */
export async function updateDesignStatus(
  designId: string,
  status: DesignStatus
): Promise<Design> {
  try {
    return await prisma.design.update({
      where: { id: designId },
      data: { status },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

/**
 * Get design with all relations
 */
export async function getDesignById(designId: string): Promise<DesignWithRelations | null> {
  try {
    return await prisma.design.findUnique({
      where: { id: designId },
      include: {
        profile: true,
        outputs: true,
      },
    }) as DesignWithRelations | null
  } catch (error) {
    handlePrismaError(error)
  }
}

/**
 * Get user's designs with pagination
 */
export async function getUserDesigns(
  userId: string,
  options: {
    page?: number
    limit?: number
    status?: DesignStatus
    orderBy?: 'createdAt' | 'updatedAt'
    orderDirection?: 'asc' | 'desc'
  } = {}
): Promise<{
  designs: DesignWithRelations[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options

    const skip = (page - 1) * limit

    const where = {
      userId,
      ...(status && { status }),
    }

    const [designs, total] = await Promise.all([
      prisma.design.findMany({
        where,
        include: {
          profile: true,
          outputs: true,
        },
        orderBy: { [orderBy]: orderDirection },
        skip,
        take: limit,
      }),
      prisma.design.count({ where }),
    ])

    return {
      designs: designs as DesignWithRelations[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    handlePrismaError(error)
  }
}

// ================================
// Design Output Operations
// ================================

/**
 * Add design output (generated image)
 */
export async function createDesignOutput(
  data: CreateDesignOutputRequest
): Promise<DesignOutput> {
  try {
    return await prisma.designOutput.create({
      data: {
        designId: data.designId,
        outputImageUrl: data.outputImageUrl,
        variationName: data.variationName,
        generationParameters: data.generationParameters as any,
      },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

/**
 * Get design outputs for a design
 */
export async function getDesignOutputs(designId: string): Promise<DesignOutput[]> {
  try {
    return await prisma.designOutput.findMany({
      where: { designId },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}





// ================================
// Analytics & Statistics
// ================================

/**
 * Get user design statistics
 */
export async function getUserStats(userId: string): Promise<{
  totalDesigns: number
  completedDesigns: number
  pendingDesigns: number
  averageRating: number | null
  totalFeedback: number
}> {
  try {
    const [
      totalDesigns,
      completedDesigns,
      pendingDesigns,
    ] = await Promise.all([
      prisma.design.count({ where: { userId } }),
      prisma.design.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.design.count({
        where: { userId, status: { in: ['PENDING', 'PROCESSING'] } },
      }),
    ])

    return {
      totalDesigns,
      completedDesigns,
      pendingDesigns,
      averageRating: null,
      totalFeedback: 0,
    }
  } catch (error) {
    handlePrismaError(error)
  }
}

/**
 * Get recent designs across all users (for admin/analytics)
 */
export async function getRecentDesigns(limit = 10): Promise<DesignWithRelations[]> {
  try {
    return await prisma.design.findMany({
      include: {
        profile: true,
        outputs: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    }) as DesignWithRelations[]
  } catch (error) {
    handlePrismaError(error)
  }
}

// ================================
// Cleanup Operations
// ================================

/**
 * Delete design and all related data
 */
export async function deleteDesign(designId: string, userId: string): Promise<void> {
  try {
    // Verify ownership
    const design = await prisma.design.findFirst({
      where: { id: designId, userId },
    })

    if (!design) {
      throw new Error('Design not found or access denied')
    }

    // Delete all related data (cascading deletes should handle this, but being explicit)
    await withTransaction(async (tx) => {
      await tx.designOutput.deleteMany({ where: { designId } })
      await tx.design.delete({ where: { id: designId } })
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

// ================================
// Search Operations
// ================================

/**
 * Search designs by prompt or preferences
 */
export async function searchDesigns(
  query: string,
  filters: {
    userId?: string
    status?: DesignStatus
    roomType?: string
    stylePreference?: string
  } = {},
  options: {
    page?: number
    limit?: number
  } = {}
): Promise<{
  designs: DesignWithRelations[]
  total: number
  page: number
  totalPages: number
}> {
  try {
    const { page = 1, limit = 10 } = options
    const skip = (page - 1) * limit

    const where = {
      AND: [
        {
          OR: [
            { description: { contains: query, mode: 'insensitive' as const } },
            { roomType: { contains: query, mode: 'insensitive' as const } },
            { stylePreference: { contains: query, mode: 'insensitive' as const } },
            { colorScheme: { contains: query, mode: 'insensitive' as const } },
            { materialPreferences: { contains: query, mode: 'insensitive' as const } },
          ],
        },
        ...(filters.userId ? [{ userId: filters.userId }] : []),
        ...(filters.status ? [{ status: filters.status }] : []),
        ...(filters.roomType ? [{ roomType: filters.roomType }] : []),
        ...(filters.stylePreference ? [{ stylePreference: filters.stylePreference }] : []),
      ],
    }

    const [designs, total] = await Promise.all([
      prisma.design.findMany({
        where,
        include: {
          profile: true,
          outputs: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.design.count({ where }),
    ])

    return {
      designs: designs as DesignWithRelations[],
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  } catch (error) {
    handlePrismaError(error)
  }
}