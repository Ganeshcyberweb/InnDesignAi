/**
 * POST /api/designs/:designId/favorite
 *
 * Body: { themeKey: string, favorite: boolean }
 *
 * Creates or removes a `design_favorites` row for the calling user. Scoped
 * server-side: the design must belong to the caller. Idempotent — re-favouring
 * a row that's already saved is a no-op, and un-favouring a row that isn't
 * saved is also a no-op.
 */
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ designId: string }> }
) {
  const userId = request.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { designId } = await context.params
  if (!UUID_RE.test(designId)) {
    return NextResponse.json(
      { success: false, error: 'Invalid design id' },
      { status: 400 }
    )
  }

  let body: { themeKey?: unknown; favorite?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const themeKey = typeof body.themeKey === 'string' ? body.themeKey.trim() : ''
  if (!themeKey || themeKey.length > 64) {
    return NextResponse.json(
      { success: false, error: 'themeKey is required (1–64 chars)' },
      { status: 400 }
    )
  }
  const favorite = body.favorite !== false // default to true

  // Ensure the design belongs to the calling user.
  const design = await prisma.design.findUnique({
    where: { id: designId },
    select: { userId: true },
  })
  if (!design) {
    return NextResponse.json(
      { success: false, error: 'Design not found' },
      { status: 404 }
    )
  }
  if (design.userId !== userId) {
    return NextResponse.json(
      { success: false, error: 'Forbidden' },
      { status: 403 }
    )
  }

  try {
    if (favorite) {
      await prisma.designFavorite.upsert({
        where: {
          userId_designId_themeKey: { userId, designId, themeKey },
        },
        create: { userId, designId, themeKey },
        update: {}, // no-op if it already exists
      })
    } else {
      await prisma.designFavorite
        .delete({
          where: {
            userId_designId_themeKey: { userId, designId, themeKey },
          },
        })
        .catch((err: any) => {
          // P2025 = "Record to delete does not exist." — treat as success.
          if (err?.code !== 'P2025') throw err
        })
    }
    return NextResponse.json({ success: true, favorite })
  } catch (error) {
    console.error('POST /api/designs/[id]/favorite failed:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update favourite' },
      { status: 500 }
    )
  }
}
