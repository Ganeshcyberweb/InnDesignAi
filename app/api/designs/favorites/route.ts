/**
 * GET /api/designs/favorites
 *
 * Returns the calling user's favourited (design, theme) pairs along with the
 * matching design metadata + the image URLs for that theme's outputs. One row
 * per favourite — already de-duplicated by the table's unique constraint.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface FavoriteRow {
  id: string
  themeKey: string
  createdAt: Date
  design: {
    id: string
    description: string | null
    title: string | null
    roomType: string | null
    createdAt: Date
    outputs: Array<{
      outputImageUrl: string
      variationName: string | null
      generationParameters: any
    }>
  }
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const favorites = (await prisma.designFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        design: {
          select: {
            id: true,
            description: true,
            title: true,
            roomType: true,
            createdAt: true,
            outputs: {
              select: {
                outputImageUrl: true,
                variationName: true,
                generationParameters: true,
              },
            },
          },
        },
      },
    })) as unknown as FavoriteRow[]

    // For each favourite, keep only the outputs whose generationParameters.theme
    // matches the favourited themeKey (filter at the app layer — keeps the SQL
    // simple, and a single design has at most a handful of outputs).
    const items = favorites.map((f) => {
      const themeOutputs = f.design.outputs.filter((o) => {
        const params = o.generationParameters as { theme?: string } | null
        return params?.theme === f.themeKey
      })

      return {
        id: f.id,
        themeKey: f.themeKey,
        themeLabel: (themeOutputs[0]?.generationParameters as any)?.themeLabel ?? f.themeKey,
        favoritedAt: f.createdAt,
        design: {
          id: f.design.id,
          title: f.design.title,
          prompt: f.design.description,
          roomType: f.design.roomType,
          createdAt: f.design.createdAt,
        },
        images: themeOutputs.map((o) => o.outputImageUrl),
      }
    })

    return NextResponse.json({ success: true, total: items.length, items })
  } catch (error) {
    console.error('GET /api/designs/favorites failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to load favourites' },
      { status: 500 }
    )
  }
}
