import { NextRequest, NextResponse } from "next/server";

/**
 * TEST ENDPOINT FOR DATABASE OPERATIONS
 * This endpoint returns mock data to test if Supabase saving works
 * Use this instead of generate-themes to isolate database testing from Gemini API
 */

// Mock image URL (will be replaced with Cloudflare URLs later)
const MOCK_IMAGE_URL = "https://placehold.co/800x600/png";

const THEMES = [
  { theme: 'modern', label: 'Modern Minimalist' },
  { theme: 'cozy', label: 'Cozy Traditional' },
  { theme: 'luxury', label: 'Luxury Contemporary' }
];

const VIEWS = ['Main View', 'Detail View'];

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { userPrompt } = body;

    console.log('\n🧪 === DATABASE TEST MODE ===');
    console.log('📝 Test Prompt:', userPrompt || '(empty)');
    console.log('🎨 Generating mock data for database testing...');

    // Simulate brief delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Generate mock results with placeholder URLs
    const results = THEMES.map(theme => ({
      theme: theme.theme,
      label: theme.label,
      images: VIEWS.map(() => MOCK_IMAGE_URL) // Mock URLs instead of base64
    }));

    const totalDuration = Date.now() - startTime;
    const totalImages = results.reduce((acc, r) => acc + r.images.length, 0);

    console.log(`\n✅ === MOCK DATA READY ===`);
    console.log(`Created ${results.length} themes with ${totalImages} mock image URLs`);
    console.log(`Time: ${totalDuration}ms`);
    console.log('=========================\n');

    return NextResponse.json({
      success: true,
      themes: results,
      metadata: {
        totalImages,
        totalDuration,
        themesGenerated: results.length,
        isTestMode: true,
      }
    });

  } catch (error) {
    console.error('\n❌ === TEST ENDPOINT ERROR ===');
    console.error('Error:', error);
    console.error('===========================\n');

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Test endpoint failed"
      },
      { status: 500 }
    );
  }
}
