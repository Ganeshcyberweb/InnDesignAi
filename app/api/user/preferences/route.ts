import { NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@/lib/supabase-server"
import { prisma } from "@/lib/database"

/**
 * GET /api/user/preferences
 * Get the current user's preferences
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get profile with preferences from database
    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
      select: {
        preferences: true,
      },
    })

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ preferences: profile.preferences || {} })
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user/preferences
 * Update the current user's preferences
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse request body
    const preferences = await request.json()

    // Validate preferences structure (optional but recommended)
    const validatedPreferences = {
      defaultStyle: preferences.defaultStyle || "modern",
      defaultViews: preferences.defaultViews || 2,
      defaultRoomType: preferences.defaultRoomType || "living-room",
    }

    // Update profile with new preferences
    const profile = await prisma.profile.update({
      where: { userId: user.id },
      data: {
        preferences: validatedPreferences,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      preferences: profile.preferences,
    })
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    )
  }
}
