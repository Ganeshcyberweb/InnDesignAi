import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSignedImageUrl, extractKeyFromR2Url } from '@/lib/r2-signed-urls';

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

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Extract the key from the R2 URL
    const key = extractKeyFromR2Url(imageUrl);
    if (!key) {
      return NextResponse.json(
        { error: 'Invalid R2 URL format' },
        { status: 400 }
      );
    }

    // Generate signed URL (valid for 1 hour)
    const signedUrl = await getSignedImageUrl(key, 3600);
    
    if (!signedUrl) {
      return NextResponse.json(
        { error: 'Failed to generate signed URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      signedUrl,
    });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}