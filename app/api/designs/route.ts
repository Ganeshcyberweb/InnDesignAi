import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    console.log('🔍 Auth debug:', { 
      hasUser: !!user, 
      userId: user?.id, 
      authError: authError?.message 
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in', success: false },
        { status: 401 }
      );
    }

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50;
    const includeRegenerations = searchParams.get('includeRegenerations') === 'true';

    // Build where clause
    const where: any = {
      userId: user.id,
    };

    if (status) {
      where.status = status;
    }

    // If not including regenerations, only get root designs (no parent)
    if (!includeRegenerations) {
      where.parentId = null;
    }

    // Fetch designs (preferences are now part of Design model)
    const designs = await prisma.design.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        outputs: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      designs,
      count: designs.length,
    });
  } catch (error) {
    console.error('Error fetching designs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch designs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, roomType, style } = body;

    if (!title && !description) {
      return NextResponse.json(
        { error: 'Missing required fields: title or description' },
        { status: 400 }
      );
    }

    // Create new design
    const design = await prisma.design.create({
      data: {
        userId: user.id,
        title: title || 'Untitled Design',
        description,
        roomType,
        style,
        status: 'PENDING',
        generationNumber: 1, // This is an original design
      },
    });

    return NextResponse.json({
      success: true,
      design,
    });
  } catch (error) {
    console.error('Error creating design:', error);
    return NextResponse.json(
      { error: 'Failed to create design' },
      { status: 500 }
    );
  }
}
