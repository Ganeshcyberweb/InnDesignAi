import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/database';

/**
 * Simple proxy endpoint to bypass CORS restrictions
 * Fetches images from R2 on the server side and returns them with proper CORS headers
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ designId: string }> }
) {
  try {
    const { designId } = await params;
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');

    console.log('\n🔄 === IMAGE PROXY REQUEST ===');
    console.log('Design ID:', designId);
    console.log('Image URL:', imageUrl?.substring(0, 80));

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Missing image URL' },
        { status: 400 }
      );
    }

    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('❌ No authenticated user');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user owns this design
    const design = await prisma.design.findUnique({
      where: { id: designId },
      select: { userId: true },
    });

    if (!design || design.userId !== user.id) {
      console.error('❌ User does not own this design');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    console.log('✅ User authenticated and authorized');
    console.log('📥 Fetching image from R2...');

    // Fetch the image
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      console.error('❌ Failed to fetch from R2:', imageResponse.status);
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: 500 }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';

    console.log(`✅ Image fetched (${(imageBuffer.byteLength / 1024).toFixed(2)} KB)`);
    console.log('===========================\n');

    // Return image with CORS headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('\n❌ === IMAGE PROXY ERROR ===');
    console.error('Error:', error);
    console.error('=========================\n');

    return NextResponse.json(
      {
        error: 'Failed to proxy image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
