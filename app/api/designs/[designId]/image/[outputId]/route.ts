import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/database';
import { getSignedImageUrl, extractKeyFromR2Url } from '@/lib/r2-signed-urls';

/**
 * Proxy endpoint to serve images with proper CORS headers
 * This solves the CORS issue when downloading images from R2
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ designId: string; outputId: string }> }
) {
  try {
    const { designId, outputId } = await params;

    console.log('\n🖼️ === IMAGE PROXY REQUEST ===');
    console.log('Design ID:', designId);
    console.log('Output ID:', outputId);

    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch the design output
    const output = await prisma.designOutput.findUnique({
      where: { id: outputId },
      include: {
        design: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!output) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (output.design.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // If it's a base64 data URL, we can't proxy it - should not reach here
    if (output.outputImageUrl.startsWith('data:image')) {
      return NextResponse.json(
        { error: 'Cannot proxy base64 images' },
        { status: 400 }
      );
    }

    console.log('📥 Fetching image from R2...');

    // Get signed URL
    let imageUrl = output.outputImageUrl;

    // If it's an R2 URL, generate fresh signed URL
    if (imageUrl.includes('r2.cloudflarestorage.com') ||
        imageUrl.includes('cloudflare') ||
        !imageUrl.startsWith('http')) {

      const key = extractKeyFromR2Url(imageUrl);
      if (key) {
        const signedUrl = await getSignedImageUrl(key, 3600);
        if (signedUrl) {
          imageUrl = signedUrl;
          console.log('   ✅ Using fresh signed URL');
        }
      }
    }

    // Fetch the image
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      console.error('❌ Failed to fetch image:', imageResponse.status);
      return NextResponse.json(
        { error: 'Failed to fetch image' },
        { status: 500 }
      );
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') || 'image/png';

    console.log(`✅ Image fetched (${(imageBuffer.byteLength / 1024).toFixed(2)} KB)`);
    console.log('=========================\n');

    // Return image with CORS headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error) {
    console.error('\n❌ === IMAGE PROXY ERROR ===');
    console.error('Error:', error);
    console.error('========================\n');

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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
