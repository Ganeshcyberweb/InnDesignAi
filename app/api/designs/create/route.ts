import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the user from Supabase auth
    const cookieStore = await cookies();
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { preferences, uploadedImageUrl, inputPrompt } = body;

    // Validate required fields
    if (!preferences || !preferences.roomType || !preferences.size || !preferences.stylePreference || !preferences.budget) {
      return NextResponse.json(
        { error: 'Missing required preferences' },
        { status: 400 }
      );
    }

    // Create the design with preferences in a transaction
    const design = await prisma.$transaction(async (tx) => {
      // Create the design record
      const newDesign = await tx.design.create({
        data: {
          userId: user.id,
          inputPrompt: inputPrompt || `Create a ${preferences.stylePreference} ${preferences.roomType} design`,
          uploadedImageUrl: uploadedImageUrl || null,
          aiModelUsed: 'pending', // Will be updated when AI generation starts
          status: 'PENDING'
        }
      });

      // Create the preferences record linked to the design
      // Convert budget categories to approximate numeric values for storage
      const budgetMap: Record<string, number> = {
        'budget': 1000,
        'mid_range': 5000,
        'luxury': 15000
      };

      const newPreferences = await tx.preferences.create({
        data: {
          designId: newDesign.id,
          roomType: preferences.roomType,
          size: preferences.size,
          stylePreference: preferences.stylePreference,
          budget: budgetMap[preferences.budget] || null,
          colorScheme: preferences.colorScheme || null,
          materialPreferences: preferences.materialPreferences ? JSON.stringify(preferences.materialPreferences) : null,
          otherRequirements: preferences.otherRequirements || null
        }
      });

      return {
        ...newDesign,
        preferences: newPreferences
      };
    });

    // Return the created design with preferences
    return NextResponse.json({
      id: design.id,
      status: design.status,
      message: 'Design created successfully'
    });

  } catch (error) {
    console.error('Error creating design:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}