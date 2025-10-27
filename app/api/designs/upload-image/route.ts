import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { uploadImageToR2 } from '@/lib/r2-storage';
import { nanoid } from 'nanoid';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

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
    const { base64Data, viewType = 'variation' } = body;

    if (!base64Data) {
      return NextResponse.json(
        { error: 'Missing base64Data' },
        { status: 400 }
      );
    }

    // Generate temporary IDs for upload
    const tempDesignId = `temp-${nanoid(10)}`;
    const tempOutputId = `output-${nanoid(10)}`;

    const uploadResult = await uploadImageToR2({
      base64Data,
      designId: tempDesignId,
      outputId: tempOutputId,
      viewType,
    });

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Failed to upload image' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      key: uploadResult.key,
    });

  } catch (error) {
    console.error('❌ Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
