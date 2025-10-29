import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getSignedImageUrl, extractKeyFromR2Url } from '@/lib/r2-signed-urls';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  const requestId = nanoid(8);
  const startTime = Date.now();
  
  console.log(`\n🟢 [${requestId}] === SIGNED URL API REQUEST START ===`);
  console.log(`🟢 [${requestId}] Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Authenticate user
    console.log(`🟢 [${requestId}] Authenticating user...`);
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error(`❌ [${requestId}] Auth error:`, authError);
      return NextResponse.json(
        { error: 'Authentication failed', details: authError.message },
        { status: 401 }
      );
    }

    if (!user) {
      console.warn(`⚠️ [${requestId}] No user found - unauthorized request`);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`✅ [${requestId}] User authenticated: ${user.id}`);

    // Parse request body
    const body = await request.json();
    const { imageUrl } = body;

    console.log(`🟢 [${requestId}] Request data:`, {
      imageUrl,
      urlLength: imageUrl?.length || 0,
    });

    if (!imageUrl) {
      console.error(`❌ [${requestId}] Missing imageUrl in request`);
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Extract the key from the R2 URL
    console.log(`🟢 [${requestId}] Extracting key from URL...`);
    const key = extractKeyFromR2Url(imageUrl);
    
    if (!key) {
      console.error(`❌ [${requestId}] Failed to extract key from URL: ${imageUrl}`);
      return NextResponse.json(
        { error: 'Invalid R2 URL format' },
        { status: 400 }
      );
    }

    console.log(`✅ [${requestId}] Key extracted: ${key}`);

    // Generate signed URL (valid for 1 hour)
    console.log(`🟢 [${requestId}] Generating signed URL (1 hour expiry)...`);
    const signedUrl = await getSignedImageUrl(key, 3600);
    
    if (!signedUrl) {
      console.error(`❌ [${requestId}] Failed to generate signed URL for key: ${key}`);
      return NextResponse.json(
        { error: 'Failed to generate signed URL' },
        { status: 500 }
      );
    }

    console.log(`✅ [${requestId}] Signed URL generated successfully`);
    console.log(`✅ [${requestId}] URL length: ${signedUrl.length}`);

    const totalDuration = Date.now() - startTime;
    console.log(`✅ [${requestId}] === SIGNED URL API REQUEST COMPLETE === (${totalDuration}ms)\n`);

    return NextResponse.json({
      success: true,
      signedUrl,
    });
  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`❌ [${requestId}] Error generating signed URL (${totalDuration}ms):`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to generate signed URL',
        requestId,
      },
      { status: 500 }
    );
  }
}