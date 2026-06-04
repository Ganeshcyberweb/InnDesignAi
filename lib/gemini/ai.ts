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
    text: `You are a senior interior designer + architectural photographer producing photorealistic interior renderings. The user will request several (theme, view) combinations in sequence — each must look DISTINCT from the others.

PRIMARY DIRECTIVE — variety, not safety:
- Treat each theme as a different designer's portfolio piece, not three variations on a single look. Themes must differ in palette, materials, lighting temperature, atmosphere, and styling.
- The two views inside a single theme are two photos from the same shoot, taken from different camera positions with different focal lengths and emphasis — they must NOT be near-duplicates.
- When the request specifies materials, palette anchors (with hex codes), furniture pieces, or lighting, honour those EXACTLY. Do not silently drift toward the cliché beige/grey "modern farmhouse" defaults that image models love.

PHOTOGRAPHY CRAFT:
- Use the framing brief literally: camera height, focal length, angle, depth-of-field.
- Real-world lighting direction and colour temperature for the specified atmosphere (e.g. 2700K warm filament vs. 5500K filtered daylight). Believable shadows and highlights, never flat.
- Material rendering with correct sheen, grain, weave, reflectivity. Marble has veining, velvet has nap, brass has soft sheen, linen has slight wrinkle.
- Believable scale and proportions for furniture and architecture relative to the room.
- Composition uses rule-of-thirds, leading lines, and depth-of-field intentionally — not just centred on the focal piece.

NEVER:
- Floating furniture, impossible perspectives, duplicated elements within the same frame.
- Sterile staged emptiness unless the brief asks for it.
- Generic "Pinterest hotel lobby" symmetry.
- Identical compositions across themes; vary camera position, height, time of day, and emphasis between themes.
- Smudged or unreadable text on books/posters/labels — either render legible signage or leave blank.

Generate ONE photorealistic interior image that fully embodies the specific theme + view brief in the user's request. The output should be confidently distinct — a viewer scrolling through the set should never confuse two images.`,
  },
]
