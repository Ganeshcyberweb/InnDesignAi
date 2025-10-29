import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadImageToR2 } from '@/lib/r2-storage';
import { nanoid } from 'nanoid';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const requestId = nanoid(8);
  const startTime = Date.now();
  
  console.log(`\n🔵 [${requestId}] === IMAGE UPLOAD REQUEST START ===`);
  console.log(`🔵 [${requestId}] Timestamp: ${new Date().toISOString()}`);
  
  try {
    // Authenticate user
    console.log(`🔵 [${requestId}] Authenticating user...`);
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
    console.log(`🔵 [${requestId}] Parsing request body...`);
    const body = await request.json();
    const { base64Data, viewType = 'variation' } = body;

    console.log(`🔵 [${requestId}] Request data:`, {
      hasBase64Data: !!base64Data,
      base64DataLength: base64Data?.length || 0,
      viewType,
    });

    if (!base64Data) {
      console.error(`❌ [${requestId}] Missing base64Data in request`);
      return NextResponse.json(
        { error: 'Missing base64Data' },
        { status: 400 }
      );
    }

    // Validate base64 format
    if (!base64Data.startsWith('data:image/')) {
      console.error(`❌ [${requestId}] Invalid base64 format - must start with 'data:image/'`);
      return NextResponse.json(
        { error: 'Invalid base64 format' },
        { status: 400 }
      );
    }

    // Generate temporary IDs for upload
    const tempDesignId = `temp-${nanoid(10)}`;
    const tempOutputId = `output-${nanoid(10)}`;

    console.log(`🔵 [${requestId}] Generated IDs:`, {
      designId: tempDesignId,
      outputId: tempOutputId,
    });

    console.log(`🔵 [${requestId}] Initiating R2 upload...`);
    const uploadStartTime = Date.now();

    const uploadResult = await uploadImageToR2({
      base64Data,
      designId: tempDesignId,
      outputId: tempOutputId,
      viewType,
    });

    const uploadDuration = Date.now() - uploadStartTime;
    console.log(`🔵 [${requestId}] Upload completed in ${uploadDuration}ms`);

    if (!uploadResult.success) {
      console.error(`❌ [${requestId}] Upload failed:`, {
        error: uploadResult.error,
        duration: uploadDuration,
      });
      return NextResponse.json(
        { error: uploadResult.error || 'Failed to upload image' },
        { status: 500 }
      );
    }

    console.log(`✅ [${requestId}] Upload successful:`, {
      url: uploadResult.url,
      key: uploadResult.key,
      duration: uploadDuration,
    });

    const totalDuration = Date.now() - startTime;
    console.log(`✅ [${requestId}] === IMAGE UPLOAD REQUEST COMPLETE === (${totalDuration}ms)\n`);

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      key: uploadResult.key,
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    console.error(`❌ [${requestId}] Image upload error (${totalDuration}ms):`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to upload image', 
        details: error instanceof Error ? error.message : 'Unknown error',
        requestId,
      },
      { status: 500 }
    );
  }
}
