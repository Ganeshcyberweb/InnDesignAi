import { NextRequest, NextResponse } from "next/server";
import googleAI, { dataUrlToPart, urlToPart, SYSTEM_INSTRUCTIONS } from "@/lib/gemini/ai";
import { buildDesignPrompt } from "@/lib/utils/prompt-builder";
import { Modality } from "@google/genai";
import { generateROIAnalysis, parseROIMetrics } from "@/lib/roi/gemini-roi-analysis";

// Theme configurations
const THEMES = [
  {
    theme: 'modern',
    label: 'Modern Minimalist',
    styleModifier: 'modern minimalist style with clean lines, neutral colors, and contemporary furniture'
  },
  {
    theme: 'cozy',
    label: 'Cozy Traditional',
    styleModifier: 'cozy traditional style with warm colors, comfortable textiles, and classic furniture'
  },
  {
    theme: 'luxury',
    label: 'Luxury Contemporary',
    styleModifier: 'luxury contemporary style with premium materials, elegant finishes, and high-end furniture'
  }
];

// View configurations for each theme
const VIEWS = [
  {
    angle: 'main',
    description: 'Main view showing the full room layout from eye level'
  },
  {
    angle: 'detail',
    description: 'Detailed view focusing on key design elements and furniture arrangement'
  }
];

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { userPrompt, images, formData } = body;

    console.log('\n🚀 === MULTI-THEME GENERATION REQUEST ===');
    console.log('📝 User Prompt:', userPrompt || '(empty)');
    console.log('🎨 Generating', THEMES.length, 'themes with', VIEWS.length, 'views each =', THEMES.length * VIEWS.length, 'total images');

    // Process uploaded images once (reuse for all generations)
    const uploadedImageParts: any[] = [];
    const furnitureImageParts: any[] = [];

    if (images && images.length > 0) {
      console.log('\n🖼️ Processing uploaded image...');
      try {
        const uploadedPart = dataUrlToPart(images[0].url);
        uploadedImageParts.push(uploadedPart);
        console.log('   ✅ Uploaded image processed');
      } catch (err) {
        console.error('   ❌ Failed to convert uploaded image:', err);
      }
    }

    // Process furniture images
    const furnitureLimit = uploadedImageParts.length > 0 ? 2 : 3;
    const furnitureItems = formData?.selectedFurnitureItems || [];
    
    console.log('\n🛋️ Processing furniture images (limit: ' + furnitureLimit + ')...');
    for (let i = 0; i < Math.min(furnitureItems.length, furnitureLimit); i++) {
      const item = furnitureItems[i];
      try {
        const furniturePart = await urlToPart(item.image_path);
        furnitureImageParts.push(furniturePart);
        console.log(`   ✅ [${i + 1}/${furnitureLimit}] ${item.name} processed`);
      } catch (err) {
        console.error(`   ❌ [${i + 1}/${furnitureLimit}] ${item.name} failed:`, err);
      }
    }

    const allImageParts = [...uploadedImageParts, ...furnitureImageParts];
    console.log(`\n📸 Total reference images: ${allImageParts.length}`);

    // Generate designs for each theme
    const results = [];

    for (const theme of THEMES) {
      console.log(`\n🎨 === Generating ${theme.label} ===`);
      const themeImages: string[] = [];

      for (const view of VIEWS) {
        console.log(`   📷 View: ${view.angle} (${view.description})`);
        
        try {
          // Build theme-specific prompt
          const basePrompt = formData
            ? buildDesignPrompt({ 
                ...formData, 
                prompt: userPrompt, 
                selectedFurnitureItems: formData.selectedFurnitureItems || [] 
              })
            : userPrompt;

          const themePrompt = `${basePrompt}\n\nSTYLE: ${theme.styleModifier}\nVIEW: ${view.description}`;

          const textPart = { text: themePrompt };

          console.log(`   🤖 Sending to Gemini API...`);
          const apiStartTime = Date.now();

          const response = await googleAI.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: {
              parts: [textPart, ...allImageParts],
            },
            config: {
              responseModalities: [Modality.IMAGE],
              systemInstruction: SYSTEM_INSTRUCTIONS,
            }
          });

          const apiDuration = Date.now() - apiStartTime;
          console.log(`   ⏱️ API Response Time: ${apiDuration}ms`);

          // Extract image data
          let imageData = null;
          if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
              if (part.inlineData && part.inlineData.data) {
                imageData = part.inlineData.data;
                console.log(`   ✅ Image generated (${Math.round(imageData.length * 0.75 / 1024)}KB)`);
                break;
              }
            }
          }

          if (imageData) {
            themeImages.push(`data:image/png;base64,${imageData}`);
          } else {
            console.log(`   ⚠️ No image data received for ${view.angle}`);
          }

        } catch (error) {
          console.error(`   ❌ Error generating ${view.angle} view:`, error);
          // Continue with next view even if one fails
        }

        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (themeImages.length > 0) {
        results.push({
          theme: theme.theme,
          label: theme.label,
          images: themeImages
        });
        console.log(`   ✅ ${theme.label} complete: ${themeImages.length}/${VIEWS.length} images`);
      }
    }

    // Generate ROI analysis after all themes are created
    let roiAnalysis = '';
    let roiMetrics = {};
    
    if (results.length > 0 && formData) {
      try {
        console.log('\n💰 === GENERATING ROI ANALYSIS ===');
        roiAnalysis = await generateROIAnalysis({
          roomType: formData.roomType || 'guest room',
          location: formData.location,
          budget: formData.budgetRange?.label || formData.budget,
          propertyType: 'hotel',
          guestProfile: formData.guestProfile,
          currentADR: formData.currentADR
        }, results);
        
        // Parse key metrics for potential database storage
        roiMetrics = parseROIMetrics(roiAnalysis);
        console.log('✅ ROI Analysis Complete');
      } catch (error) {
        console.error('⚠️ ROI Analysis failed, continuing without it:', error);
      }
    }

    const totalDuration = Date.now() - startTime;
    console.log(`\n✅ === GENERATION COMPLETE ===`);
    console.log(`Generated ${results.length} themes with ${results.reduce((acc, r) => acc + r.images.length, 0)} total images`);
    console.log(`ROI Analysis: ${roiAnalysis ? 'Generated' : 'Skipped'}`);
    console.log(`Total Time: ${(totalDuration / 1000).toFixed(1)}s`);
    console.log('=================================\n');

    return NextResponse.json({
      success: true,
      themes: results,
      roiAnalysis,
      roiMetrics,
      metadata: {
        totalImages: results.reduce((acc, r) => acc + r.images.length, 0),
        totalDuration,
        themesGenerated: results.length,
        hasROIAnalysis: !!roiAnalysis
      }
    });

  } catch (error) {
    console.error('\n❌ === MULTI-THEME GENERATION ERROR ===');
    console.error('Error:', error);
    console.error('=================================\n');

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate themes"
      },
      { status: 500 }
    );
  }
}
