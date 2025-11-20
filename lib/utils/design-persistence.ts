import type { SerializedImage } from '@/stores/pending-design-store';

/**
 * Maximum file size for image storage (5MB)
 * This prevents sessionStorage overflow
 */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Convert File objects to base64 strings for storage
 * @param files Array of File objects
 * @returns Promise resolving to array of SerializedImage objects
 */
export async function filesToBase64(files: File[]): Promise<SerializedImage[]> {
  const serializedImages: SerializedImage[] = [];

  for (const file of files) {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.warn(
        `⚠️ File "${file.name}" exceeds size limit (${file.size} bytes). Skipping.`
      );
      continue;
    }

    try {
      const base64 = await fileToBase64(file);
      serializedImages.push({
        name: file.name,
        base64,
        type: file.type,
        size: file.size,
      });
    } catch (error) {
      console.error(`❌ Failed to convert file "${file.name}" to base64:`, error);
    }
  }

  return serializedImages;
}

/**
 * Convert a single File to base64 string
 * @param file File object
 * @returns Promise resolving to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as base64'));
      }
    };

    reader.onerror = () => {
      reject(new Error('FileReader error'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 strings back to File objects
 * @param serializedImages Array of SerializedImage objects
 * @returns Array of File objects
 */
export function base64ToFiles(serializedImages: SerializedImage[]): File[] {
  const files: File[] = [];

  for (const image of serializedImages) {
    try {
      const file = base64ToFile(image.base64, image.name, image.type);
      files.push(file);
    } catch (error) {
      console.error(`❌ Failed to convert base64 to file "${image.name}":`, error);
    }
  }

  return files;
}

/**
 * Convert a single base64 string to File object
 * @param base64 Base64 string (with data URI prefix)
 * @param fileName File name
 * @param fileType MIME type
 * @returns File object
 */
function base64ToFile(base64: string, fileName: string, fileType: string): File {
  // Remove data URI prefix if present
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;

  // Convert base64 to binary
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Create blob and convert to File
  const blob = new Blob([bytes], { type: fileType });
  return new File([blob], fileName, { type: fileType });
}

/**
 * Calculate total size of serialized images in bytes
 * @param images Array of SerializedImage objects
 * @returns Total size in bytes
 */
export function calculateTotalImageSize(images: SerializedImage[]): number {
  return images.reduce((total, image) => total + (image.base64?.length || 0), 0);
}

/**
 * Validate if images can be stored in sessionStorage (typically ~5-10MB limit)
 * @param images Array of SerializedImage objects
 * @returns Boolean indicating if storage is safe
 */
export function validateStorageSize(images: SerializedImage[]): boolean {
  const totalSize = calculateTotalImageSize(images);
  const storageLimit = 5 * 1024 * 1024; // 5MB conservative limit

  if (totalSize > storageLimit) {
    console.warn(
      `⚠️ Total image size (${(totalSize / 1024 / 1024).toFixed(2)}MB) exceeds storage limit`
    );
    return false;
  }

  return true;
}
