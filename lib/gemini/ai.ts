import { GoogleGenAI } from "@google/genai";

const googleAI = new GoogleGenAI({});

export default googleAI;

// Helper function to convert a File object to a Gemini API Part
export const fileToPart = async (file: File): Promise<{ inlineData: { mimeType: string; data: string; } }> => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });

    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");

    const mimeType = mimeMatch[1];
    const data = arr[1];
    return { inlineData: { mimeType, data } };
};

// Convert data URL (from FileUIPart) to Gemini image part
export const dataUrlToPart = (dataUrl: string): { inlineData: { mimeType: string; data: string; } } => {
    console.log('      🔄 Converting data URL to Gemini format...');

    const arr = dataUrl.split(',');
    if (arr.length < 2) {
        console.error('      ❌ Invalid data URL format');
        throw new Error("Invalid data URL");
    }

    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) {
        console.error('      ❌ Could not parse MIME type');
        throw new Error("Could not parse MIME type from data URL");
    }

    const mimeType = mimeMatch[1];
    const data = arr[1]; // Base64 string

    // Validate supported image formats for Gemini API
    const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const unsupportedFormats = ['image/avif', 'image/heic', 'image/heif'];
    
    if (unsupportedFormats.includes(mimeType.toLowerCase())) {
        const formatName = mimeType.split('/')[1]?.toUpperCase() || 'Unknown';
        console.error(`      ❌ Unsupported format: ${formatName}`);
        throw new Error(
            `Image format not supported: ${formatName}. ` +
            `Please use JPEG, PNG, WebP, or GIF format instead.`
        );
    }

    if (!supportedFormats.includes(mimeType.toLowerCase())) {
        console.warn(`      ⚠️ Unknown MIME type: ${mimeType}, proceeding anyway...`);
    }

    console.log('      ✅ Conversion successful - MIME:', mimeType, 'Length:', data.length);

    return { inlineData: { mimeType, data } };
};

// Convert blob to base64 string (Node.js server-side compatible)
const blobToBase64 = async (blob: Blob): Promise<string> => {
    // Use Node.js Buffer API instead of FileReader (which is browser-only)
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
};

// Fetch image URL and convert to Gemini image part
export const urlToPart = async (url: string): Promise<{ inlineData: { mimeType: string; data: string; } }> => {
    console.log('      🔄 Fetching image from URL...');

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('      ❌ HTTP', response.status, response.statusText);
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        console.log('      ✅ Image fetched successfully, converting to base64...');

        const blob = await response.blob();
        const base64Data = await blobToBase64(blob);
        const mimeType = blob.type || 'image/jpeg';

        console.log('      ✅ Conversion complete - MIME:', mimeType, 'Size:', Math.round(blob.size / 1024), 'KB');

        return { inlineData: { mimeType, data: base64Data } };
    } catch (err) {
        console.error('      ❌ URL fetch error:', err);
        throw err;
    }
};

export const SYSTEM_INSTRUCTIONS = [
  {
    text: `You are an expert interior designer with 20+ years of experience creating stunning, functional spaces. You specialize in generating photorealistic interior design images that perfectly blend aesthetics with functionality.

EXPERTISE AREAS:
- Space planning and room layout optimization
- Color theory and palette coordination
- Furniture selection and arrangement
- Lighting design (natural and artificial)
- Material and texture combinations
- Style interpretation (modern, traditional, scandinavian, industrial, bohemian, mediterranean)
- Budget-conscious design solutions
- Ergonomics and accessibility

IMAGE GENERATION STANDARDS:
- Create photorealistic, high-quality interior images
- Ensure proper perspective and realistic proportions
- Use natural lighting with appropriate shadows and highlights
- Include rich textures and materials that match the specified style
- Show complete room views with all essential furniture and decor
- Maintain consistency in design style throughout the space
- Add complementary accessories and finishing touches
- Ensure colors are vibrant yet realistic

COMPOSITION GUIDELINES:
- Frame shots to show the complete room layout
- Include windows or light sources for natural illumination
- Position furniture for optimal traffic flow
- Add plants, artwork, and decorative elements for warmth
- Show proper scale relationships between all elements
- Create visual focal points and design hierarchy
- Demonstrate the lifestyle and atmosphere of the space

Generate interior designs that are both inspiring and practically achievable.`,
  },
]
