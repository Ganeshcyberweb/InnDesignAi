import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/database';
import { getSignedImageUrl, extractKeyFromR2Url } from '@/lib/r2-signed-urls';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ designId: string }> }
) {
  try {
    const { designId } = await params;

    console.log('\n📦 === DESIGN DOWNLOAD REQUEST ===');
    console.log('Design ID:', designId);

    // Authenticate user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch design with outputs
    const design = await prisma.design.findUnique({
      where: { id: designId },
      include: {
        outputs: true,
      },
    });

    if (!design) {
      return NextResponse.json(
        { error: 'Design not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (design.userId !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to download this design' },
        { status: 403 }
      );
    }

    console.log(`✅ Found design with ${design.outputs?.length || 0} outputs`);

    // Process images - generate signed URLs for R2 images or return base64 as-is
    const processedOutputs = await Promise.all(
      (design.outputs || []).map(async (output) => {
        let processedUrl = output.outputImageUrl;
        let isBase64 = false;

        // Check if it's a base64 data URL
        if (output.outputImageUrl.startsWith('data:image')) {
          console.log(`  📸 Output ${output.id.slice(0, 8)}: Base64 data URL`);
          console.log(`     → Keeping as-is for direct blob conversion`);
          isBase64 = true;
          processedUrl = output.outputImageUrl; // Keep as-is for direct blob conversion
        }
        // Check if it's an R2 URL (needs fresh signed URL)
        else if (output.outputImageUrl.includes('r2.cloudflarestorage.com') ||
                 output.outputImageUrl.includes('cloudflare') ||
                 !output.outputImageUrl.startsWith('http')) {
          console.log(`  ☁️ Output ${output.id.slice(0, 8)}: R2 URL detected`);
          console.log(`     → Original URL: ${output.outputImageUrl.substring(0, 80)}...`);

          try {
            // Extract the key from the R2 URL
            const key = extractKeyFromR2Url(output.outputImageUrl);

            if (!key) {
              console.error(`     ❌ Failed to extract key from URL`);
              // Fall back to original URL
              processedUrl = output.outputImageUrl;
            } else {
              console.log(`     → Extracted key: ${key}`);

              // Generate signed URL with 2-hour expiry
              const signedUrl = await getSignedImageUrl(key, 7200);

              if (signedUrl) {
                processedUrl = signedUrl;
                console.log(`     ✅ Fresh signed URL generated (expires in 2h)`);
              } else {
                console.warn(`     ⚠️ Failed to generate signed URL, using original`);
                processedUrl = output.outputImageUrl;
              }
            }
          } catch (error) {
            console.error(`     ❌ Error generating signed URL:`, error);
            // Fall back to original URL
            processedUrl = output.outputImageUrl;
          }
        } else {
          console.log(`  🌐 Output ${output.id.slice(0, 8)}: External URL (using as-is)`);
          console.log(`     → URL: ${output.outputImageUrl.substring(0, 80)}...`);
        }

        return {
          ...output,
          outputImageUrl: processedUrl,
          isBase64,
        };
      })
    );

    console.log('✅ === DOWNLOAD DATA PREPARED ===\n');

    // Return the processed outputs with fresh signed URLs (no proxy needed)
    return NextResponse.json({
      success: true,
      design: {
        ...design,
        outputs: processedOutputs,
        // Also include designOutputs for backward compatibility
        designOutputs: processedOutputs,
      },
    });

  } catch (error) {
    console.error('\n❌ === DOWNLOAD PREPARATION ERROR ===');
    console.error('Error:', error);
    console.error('===================================\n');

    return NextResponse.json(
      {
        error: 'Failed to prepare download',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
