/**
 * Database operations for InnDesign AI - Interior Design Platform
 * Comprehensive utility functions for design workflow operations
 */

import { prisma, handlePrismaError, withTransaction } from './prisma'
import type {
  Profile,
  Design,
  Preferences,
  DesignOutput,
  RoiCalculation,
  Feedback,
  UserRole,
  DesignStatus,
  FeedbackType,
} from '../generated/prisma'

// ================================
// Type Definitions
// ================================

export interface CreateDesignRequest {
  userId: string
  inputPrompt: string
  uploadedImageUrl?: string
  aiModelUsed: string
  preferences: {
    roomType: string
    size: string
    stylePreference: string
    budget?: number
    colorScheme?: string
    materialPreferences?: string
    otherRequirements?: string
  }
}

export interface CreateDesignOutputRequest {
  designId: string
  outputImageUrl: string
  variationName?: string
  generationParameters?: Record<string, any>
}

export interface CreateRoiCalculationRequest {
  designId: string
  estimatedCost: number
  roiPercentage: number
  paybackTimeline?: string
  costBreakdown?: Record<string, any>
  notes?: string
}

export interface CreateFeedbackRequest {
  designId: string
  userId: string
  rating: number
  comments?: string
  type?: FeedbackType
  helpful?: boolean
  metadata?: Record<string, any>
}

export interface DesignWithRelations extends Design {
  profile: Profile
  preferences: Preferences | null
  designOutputs: DesignOutput[]
  roiCalculation: RoiCalculation | null
  feedback: Feedback[]
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
 * Create a new design with preferences
 */
export async function createDesignWithPreferences(
  data: CreateDesignRequest
): Promise<DesignWithRelations> {
  try {
    return await withTransaction(async (tx) => {
      // Create the design
      const design = await tx.design.create({
        data: {
          userId: data.userId,
          inputPrompt: data.inputPrompt,
          uploadedImageUrl: data.uploadedImageUrl,
          aiModelUsed: data.aiModelUsed,
          status: 'PENDING',
        },
      })

      // Create associated preferences
      await tx.preferences.create({
        data: {
          designId: design.id,
          ...data.preferences,
        },
      })

      // Return design with all relations
      return await tx.design.findUnique({
        where: { id: design.id },
        include: {
          profile: true,
          preferences: true,
          designOutputs: true,
          roiCalculation: true,
          feedback: true,
        },
      }) as DesignWithRelations
    })
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
        preferences: true,
        designOutputs: true,
        roiCalculation: true,
        feedback: true,
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
          preferences: true,
          designOutputs: true,
          roiCalculation: true,
          feedback: true,
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
      data,
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
// ROI Calculation Operations
// ================================

/**
 * Create or update ROI calculation for a design
 */
export async function upsertRoiCalculation(
  data: CreateRoiCalculationRequest
): Promise<RoiCalculation> {
  try {
    return await prisma.roiCalculation.upsert({
      where: { designId: data.designId },
      create: data,
      update: {
        estimatedCost: data.estimatedCost,
        roiPercentage: data.roiPercentage,
        paybackTimeline: data.paybackTimeline,
        costBreakdown: data.costBreakdown,
        notes: data.notes,
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

/**
 * Get ROI calculation for a design
 */
export async function getRoiCalculation(designId: string): Promise<RoiCalculation | null> {
  try {
    return await prisma.roiCalculation.findUnique({
      where: { designId },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

// ================================
// Feedback Operations
// ================================

/**
 * Create feedback for a design
 */
export async function createFeedback(data: CreateFeedbackRequest): Promise<Feedback> {
  try {
    return await prisma.feedback.create({
      data,
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

/**
 * Get feedback for a design
 */
export async function getDesignFeedback(designId: string): Promise<Feedback[]> {
  try {
    return await prisma.feedback.findMany({
      where: { designId },
      include: {
        profile: {
          select: {
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    handlePrismaError(error)
  }
}

/**
 * Get average rating for a design
 */
export async function getDesignAverageRating(designId: string): Promise<number | null> {
  try {
    const result = await prisma.feedback.aggregate({
      where: { designId },
      _avg: {
        rating: true,
      },
      _count: {
        rating: true,
      },
    })

    return result._count.rating > 0 ? result._avg.rating : null
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
      averageRatingResult,
      totalFeedback,
    ] = await Promise.all([
      prisma.design.count({ where: { userId } }),
      prisma.design.count({ where: { userId, status: 'COMPLETED' } }),
      prisma.design.count({
        where: { userId, status: { in: ['PENDING', 'PROCESSING'] } },
      }),
      prisma.feedback.aggregate({
        where: { design: { userId } },
        _avg: { rating: true },
        _count: { rating: true },
      }),
      prisma.feedback.count({ where: { design: { userId } } }),
    ])

    return {
      totalDesigns,
      completedDesigns,
      pendingDesigns,
      averageRating:
        averageRatingResult._count.rating > 0 ? averageRatingResult._avg.rating : null,
      totalFeedback,
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
        preferences: true,
        designOutputs: true,
        roiCalculation: true,
        feedback: true,
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
      await tx.feedback.deleteMany({ where: { designId } })
      await tx.roiCalculation.deleteMany({ where: { designId } })
      await tx.designOutput.deleteMany({ where: { designId } })
      await tx.preferences.deleteMany({ where: { designId } })
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
            { inputPrompt: { contains: query, mode: 'insensitive' as const } },
            {
              preferences: {
                OR: [
                  { roomType: { contains: query, mode: 'insensitive' as const } },
                  { stylePreference: { contains: query, mode: 'insensitive' as const } },
                  { colorScheme: { contains: query, mode: 'insensitive' as const } },
                  { materialPreferences: { contains: query, mode: 'insensitive' as const } },
                ],
              },
            },
          ],
        },
        ...(filters.userId ? [{ userId: filters.userId }] : []),
        ...(filters.status ? [{ status: filters.status }] : []),
        ...(filters.roomType
          ? [{ preferences: { roomType: filters.roomType } }]
          : []),
        ...(filters.stylePreference
          ? [{ preferences: { stylePreference: filters.stylePreference } }]
          : []),
      ],
    }

    const [designs, total] = await Promise.all([
      prisma.design.findMany({
        where,
        include: {
          profile: true,
          preferences: true,
          designOutputs: true,
          roiCalculation: true,
          feedback: true,
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