import { NextRequest, NextResponse } from 'next/server';
import { createRegeneration } from '@/lib/design-regeneration';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/database';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    console.log('\n🔄 === DESIGN REGENERATION REQUEST ===');

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.log('❌ Authentication failed: No user session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔐 User Authenticated:', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString()
    });

    const body = await request.json();
    const { parentDesignId, inputPrompt, aiModelUsed, uploadedImageUrl } = body;

    console.log('📊 Regeneration Request:', {
      parentDesignId,
      promptLength: inputPrompt?.length || 0,
      hasUploadedImage: !!uploadedImageUrl,
      aiModel: aiModelUsed,
    });

    if (!parentDesignId || !inputPrompt || !aiModelUsed) {
      console.log('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the parent design exists and belongs to the user
    console.log('🔍 Validating parent design...');
    const parentDesign = await prisma.design.findUnique({
      where: { id: parentDesignId },
      select: { userId: true, generationNumber: true },
    });

    if (!parentDesign) {
      console.log('❌ Parent design not found:', parentDesignId);
      return NextResponse.json(
        { error: 'Parent design not found' },
        { status: 404 }
      );
    }

    if (parentDesign.userId !== user.id) {
      console.log('❌ Unauthorized regeneration attempt:', {
        parentUserId: parentDesign.userId,
        requestUserId: user.id
      });
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    console.log('✅ Parent design validated, current generation:', parentDesign.generationNumber);

    // Create the regeneration
    console.log('💾 Creating regeneration design...');
    const regenerationStartTime = Date.now();

    const newDesign = await createRegeneration(
      parentDesignId,
      user.id,
      inputPrompt,
      aiModelUsed,
      uploadedImageUrl
    );

    const regenerationDuration = Date.now() - regenerationStartTime;

    // Get user's total design count
    const userDesignCount = await prisma.design.count({
      where: { userId: user.id }
    });

    const totalDuration = Date.now() - startTime;

    console.log('✅ === REGENERATION COMPLETE ===');
    console.log('Summary:', {
      newDesignId: newDesign.id,
      parentDesignId: parentDesignId,
      generationNumber: newDesign.generationNumber,
      status: newDesign.status,
      userTotalDesigns: userDesignCount,
      regenerationDuration: `${regenerationDuration}ms`,
      totalDuration: `${totalDuration}ms`
    });
    console.log('================================\n');

    return NextResponse.json({
      success: true,
      design: newDesign,
      metadata: {
        userTotalDesigns: userDesignCount,
        processingTime: totalDuration,
      }
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;

    console.error('\n❌ === REGENERATION ERROR ===');
    console.error('Error Type:', error?.constructor?.name);
    console.error('Error Message:', error instanceof Error ? error.message : String(error));
    console.error('Duration before error:', `${totalDuration}ms`);

    if (error instanceof Error && error.stack) {
      console.error('Stack Trace:', error.stack);
    }

    console.error('============================\n');

    return NextResponse.json(
      { error: 'Failed to create regeneration' },
      { status: 500 }
    );
  }
}
