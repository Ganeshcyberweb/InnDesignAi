import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/database';

/**
 * GET /api/designs/[designId]
 * Fetch a single design by ID with all related data
 * Used for regeneration flow to display previous design context
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ designId: string }> }
) {
  try {
    const { designId } = await params;
    console.log('\n📖 === FETCH DESIGN REQUEST ===');
    console.log('Design ID:', designId);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('❌ Authentication failed');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔐 User authenticated:', user.id);

    // Fetch design with all related data (preferences now part of Design model)
    const design = await prisma.design.findUnique({
      where: {
        id: designId,
      },
      include: {
        outputs: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        parentDesign: {
          select: {
            id: true,
            generationNumber: true,
          },
        },
      },
    });

    if (!design) {
      console.log('❌ Design not found:', designId);
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (design.userId !== user.id) {
      console.log('❌ Unauthorized access attempt:', {
        designUserId: design.userId,
        requestUserId: user.id,
      });
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    console.log('✅ Design found:', {
      designId: design.id,
      generationNumber: design.generationNumber,
      outputsCount: design.outputs.length,
      hasPreferences: !!(design.size || design.stylePreference || design.colorScheme),
      hasParent: !!design.parentDesign,
    });
    console.log('===========================\n');

    return NextResponse.json({
      success: true,
      design,
    });

  } catch (error) {
    console.error('\n❌ === FETCH DESIGN ERROR ===');
    console.error('Error:', error);
    console.error('===========================\n');

    return NextResponse.json(
      {
        error: 'Failed to fetch design',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
