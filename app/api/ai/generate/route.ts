import { NextRequest, NextResponse } from "next/server";
import googleAI, { fileToPart, SYSTEM_INSTRUCTIONS } from "@/lib/gemini/ai";
import fs from "fs";
import { MediaResolution, Modality } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userPrompt, images } = body.prompt;

    const textPart = {
      text: userPrompt,
    };

    const imageParts = images.map((image: File) => fileToPart(image));

    const response = await googleAI.models.generateContent({
      model: "gemini-2.5-flash-image-preview", // nano banana
      contents: {
        parts: [textPart, ...imageParts],
        
      },
      config: {
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_HIGH,
        responseModalities: [Modality.IMAGE],
        systemInstruction: SYSTEM_INSTRUCTIONS,
      }
    });

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
          console.log(part.text);
        } else if (part.inlineData && part.inlineData.data) {
          imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, "base64");
          fs.writeFileSync("gemini-native-image.png", buffer);
          console.log("Image saved as gemini-native-image.png");
        }
      }
    }

    return NextResponse.json({
      success: true,
      generatedText,
      hasImage: !!imageData,
    });
  } catch (error) {
    console.error("Error in AI generation:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
