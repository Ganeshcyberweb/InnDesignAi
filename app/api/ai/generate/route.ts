import { NextRequest, NextResponse } from "next/server";
import googleAI, { dataUrlToPart, urlToPart, SYSTEM_INSTRUCTIONS } from "@/lib/gemini/ai";
import { buildDesignPrompt } from "@/lib/utils/prompt-builder";
import fs from "fs";
import { MediaResolution, Modality } from "@google/genai";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const { userPrompt, images, formData } = body;

    // === REQUEST INPUT LOGGING ===
    console.log('\n🚀 === GEMINI IMAGE GENERATION REQUEST ===');
    console.log('📝 User Prompt:', userPrompt || '(empty)');
    console.log('📋 Form Data:', JSON.stringify({
      roomType: formData?.roomType,
      stylePreference: formData?.stylePreference,
      budgetRange: formData?.budgetRange,
      roomSize: formData?.roomSize,
      colorPalette: formData?.colorPalette
    }, null, 2));
    console.log('📸 Uploaded Images Count:', images?.length || 0);
    console.log('🛋️ Furniture Items Count:', formData?.selectedFurnitureItems?.length || 0);

    // Build enhanced prompt using form data
    const enhancedPrompt = formData
      ? buildDesignPrompt({ ...formData, prompt: userPrompt, selectedFurnitureItems: formData.selectedFurnitureItems || [] })
      : userPrompt;

    // === ENHANCED PROMPT LOGGING ===
    console.log('\n📜 Enhanced Prompt Length:', enhancedPrompt.length, 'characters');
    console.log('📜 Enhanced Prompt Preview:', enhancedPrompt.substring(0, 200) + '...');
    if (process.env.DEBUG_VERBOSE === 'true') {
      console.log('\n📜 FULL ENHANCED PROMPT:\n', enhancedPrompt);
    }

    const textPart = {
      text: enhancedPrompt,
    };

    // === IMAGE PROCESSING LOGGING ===
    const uploadedImageParts: any[] = [];
    const furnitureImageParts: any[] = [];

    // Process uploaded images (FileUIPart with data URLs)
    if (images && images.length > 0) {
      console.log('\n🖼️ Processing uploaded image...');
      console.log('   - URL preview:', images[0].url.substring(0, 50) + '...');
      console.log('   - MIME type:', images[0].mediaType || 'unknown');
      console.log('   - Filename:', images[0].filename || 'unnamed');

      try {
        const uploadedPart = dataUrlToPart(images[0].url);
        console.log('   ✅ Converted to Gemini format, data length:', uploadedPart.inlineData.data.length);
        uploadedImageParts.push(uploadedPart);
      } catch (err) {
        console.error('   ❌ Failed to convert uploaded image:', err);
      }
    } else {
      console.log('\n🖼️ No uploaded images');
    }

    // Process furniture images (URLs to fetch and convert)
    const furnitureLimit = uploadedImageParts.length > 0 ? 2 : 3;
    const furnitureItems = formData?.selectedFurnitureItems || [];

    console.log('\n🛋️ Processing furniture images (limit: ' + furnitureLimit + ')...');
    for (let i = 0; i < Math.min(furnitureItems.length, furnitureLimit); i++) {
      const item = furnitureItems[i];
      console.log(`   [${i + 1}/${furnitureLimit}] ${item.name}`);
      console.log(`       URL: ${item.image_path}`);

      try {
        const furniturePart = await urlToPart(item.image_path);
        console.log(`       ✅ Fetched and converted, data length: ${furniturePart.inlineData.data.length}`);
        furnitureImageParts.push(furniturePart);
      } catch (err) {
        console.error(`       ❌ Failed to fetch furniture image:`, err);
      }
    }

    // Combine all image parts (max 3 total for Gemini)
    const allImageParts = [...uploadedImageParts, ...furnitureImageParts];

    console.log(`\n📸 Final Image Count: ${uploadedImageParts.length} uploaded + ${furnitureImageParts.length} furniture = ${allImageParts.length} total`);

    // === GEMINI API REQUEST LOGGING ===
    console.log('\n🤖 Sending to Gemini API...');
    console.log('   Model: gemini-2.5-flash-image');
    console.log('   Content Parts:', (1 + allImageParts.length), '(1 text +', allImageParts.length, 'images)');
    console.log('   Prompt Length:', enhancedPrompt.length, 'chars');
    console.log('   Config:', {
      responseModalities: ['IMAGE']
    });

    const apiStartTime = Date.now();

    const response = await googleAI.models.generateContent({
      model: "gemini-2.5-flash-image", // Correct model for image generation
      contents: {
        parts: [textPart, ...allImageParts],

      },
      config: {
        responseModalities: [Modality.IMAGE],
        systemInstruction: SYSTEM_INSTRUCTIONS,
      }
    });

    const apiDuration = Date.now() - apiStartTime;
    console.log('\n⏱️ Gemini API Response Time:', apiDuration, 'ms');

    // === RESPONSE STRUCTURE LOGGING ===
    console.log('\n📦 Gemini Response Structure:');
    console.log('   - Has candidates:', !!response.candidates);
    console.log('   - Candidates count:', response.candidates?.length || 0);

    if (response.candidates?.[0]) {
      console.log('   - First candidate has content:', !!response.candidates[0].content);
      console.log('   - Content parts count:', response.candidates[0].content?.parts?.length || 0);

      response.candidates[0].content?.parts?.forEach((part, idx) => {
        console.log(`   - Part ${idx}:`, {
          hasText: !!part.text,
          hasInlineData: !!part.inlineData,
          textLength: part.text?.length,
          imageDataLength: part.inlineData?.data?.length
        });
      });
    }

    let generatedText = "";
    let imageData = null;

    if (
      response.candidates &&
      response.candidates[0] &&
      response.candidates[0].content &&
      response.candidates[0].content.parts
    ) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          generatedText += part.text;
          console.log('\n📝 Generated Text:', part.text);
        } else if (part.inlineData && part.inlineData.data) {
          imageData = part.inlineData.data;

          // === IMAGE EXTRACTION LOGGING ===
          console.log('\n✅ Image Generated Successfully!');
          console.log('   - MIME Type:', part.inlineData.mimeType);
          console.log('   - Base64 Length:', imageData.length, 'characters');
          console.log('   - Estimated Size:', Math.round(imageData.length * 0.75 / 1024), 'KB');

          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
          console.log('   - Saved to: gemini-native-image.png');
        }
      }
    }

    // === SUCCESS SUMMARY LOGGING ===
    const totalDuration = Date.now() - startTime;
    console.log('\n✅ === GENERATION COMPLETE ===');
    console.log('Success:', !!imageData);
    console.log('Has Image:', !!imageData);
    console.log('Has Text:', !!generatedText);
    console.log('Total Processing Time:', totalDuration, 'ms');
    console.log('=================================\n');

    return NextResponse.json({
      success: true,
      generatedText,
      imageData,
      hasImage: !!imageData,
    });
  } catch (error) {
    // === ENHANCED ERROR LOGGING ===
    console.error('\n❌ === GEMINI GENERATION ERROR ===');
    console.error('Error Type:', error?.constructor?.name);
    console.error('Error Message:', error instanceof Error ? error.message : String(error));

    if (error && typeof error === 'object') {
      console.error('Error Details:', JSON.stringify(error, null, 2));

      // Log stack trace in development
      if (process.env.NODE_ENV === 'development' && error instanceof Error) {
        console.error('Stack Trace:', error.stack);
      }
    }

    // Specific error categorization
    if (error instanceof Error) {
      if (error.message.includes('Image format not supported') || error.message.includes('Unsupported MIME type')) {
        console.error('🖼️ Error Category: Unsupported Image Format');
        
        // Extract format name if available
        let formatInfo = '';
        const formatMatch = error.message.match(/image\/(\w+)/i);
        if (formatMatch) {
          formatInfo = formatMatch[1].toUpperCase();
        }
        
        return NextResponse.json(
          {
            success: false,
            error: error.message.includes('Image format not supported') 
              ? error.message 
              : `Image format not supported${formatInfo ? `: ${formatInfo}` : ''}. Please upload images in JPEG, PNG, WebP, or GIF format.`,
            errorType: 'UNSUPPORTED_FORMAT'
          },
          { status: 400 }
        );
      } else if (error.message.includes('quota') || error.message.includes('429')) {
        console.error('🚫 Error Category: Quota Exceeded');
        return NextResponse.json(
          {
            success: false,
            error: "API quota exceeded. Please try again in a few moments or upgrade your API plan.",
            retryAfter: 21000 // 21 seconds
          },
          { status: 429 }
        );
      } else if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        console.error('🌐 Error Category: Network/Fetch Error - Check furniture image URLs');
      } else if (error.message.includes('Invalid data URL')) {
        console.error('🖼️ Error Category: Invalid Image Data - Check uploaded image format');
      } else if (error.message.includes('MIME')) {
        console.error('📄 Error Category: MIME Type Error - Check image format');
      } else {
        console.error('⚠️ Error Category: Unknown Error');
      }
    }

    console.error('Total Time Before Error:', Date.now() - startTime, 'ms');
    console.error('=================================\n');

    return NextResponse.json(
      { success: false, error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
