import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

// Validate required environment variables
const requiredEnvVars = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.warn(
    `⚠️ Missing R2 environment variables: ${missingEnvVars.join(', ')}. R2 storage will not be available.`
  );
}

// Initialize R2 client (S3-compatible)
const r2Client = process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY
  ? new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    })
  : null;

export interface UploadImageOptions {
  base64Data: string; // Full data URL (data:image/png;base64,...)
  designId: string;
  outputId: string;
  viewType: 'main' | 'detail' | 'variation';
}

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Convert base64 data URL to buffer and extract MIME type
 */
function parseBase64DataUrl(dataUrl: string): { buffer: Buffer; mimeType: string; extension: string } {
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 data URL format');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  // Map MIME type to file extension
  const extensionMap: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };

  const extension = extensionMap[mimeType.toLowerCase()] || 'png';

  return { buffer, mimeType, extension };
}

/**
 * Upload a base64 image to Cloudflare R2 storage
 */
export async function uploadImageToR2(options: UploadImageOptions): Promise<UploadResult> {
  const uploadStart = Date.now();

  try {
    if (!r2Client) {
      console.error('❌ R2 client not initialized. Check environment variables.');
      return {
        success: false,
        error: 'R2 storage not configured',
      };
    }

    console.log(`   🔄 Uploading to R2: ${options.viewType} view for output ${options.outputId}`);

    const { buffer, mimeType, extension } = parseBase64DataUrl(options.base64Data);
    const fileSize = buffer.length;
    const fileSizeKB = Math.round(fileSize / 1024);

    console.log(`      📊 Image size: ${fileSizeKB} KB, MIME: ${mimeType}`);

    // Generate unique key with organized structure
    const uniqueId = nanoid(10);
    const key = `designs/${options.designId}/${options.outputId}_${options.viewType}_${uniqueId}.${extension}`;

    console.log(`      🔑 Storage key: ${key}`);

    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      ContentLength: fileSize,
      CacheControl: 'public, max-age=31536000, immutable', // 1 year cache
    });

    await r2Client.send(command);

    const uploadDuration = Date.now() - uploadStart;
    console.log(`      ✅ Upload complete (${uploadDuration}ms)`);

    // Construct public URL
    // If R2_PUBLIC_URL is set, use it (for custom domains), otherwise use default R2 URL
    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL}/${key}`
      : `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

    return {
      success: true,
      url: publicUrl,
      key,
    };
  } catch (error) {
    const uploadDuration = Date.now() - uploadStart;
    console.error(`      ❌ R2 upload failed (${uploadDuration}ms):`, error instanceof Error ? error.message : error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown upload error',
    };
  }
}

/**
 * Delete an image from R2 storage
 */
export async function deleteImageFromR2(key: string): Promise<boolean> {
  try {
    if (!r2Client) {
      console.error('❌ R2 client not initialized');
      return false;
    }

    console.log(`   🗑️ Deleting from R2: ${key}`);

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    await r2Client.send(command);
    console.log(`   ✅ Deleted successfully`);

    return true;
  } catch (error) {
    console.error(`   ❌ R2 delete failed:`, error instanceof Error ? error.message : error);
    return false;
  }
}

/**
 * Check if an image exists in R2 storage
 */
export async function imageExistsInR2(key: string): Promise<boolean> {
  try {
    if (!r2Client) {
      return false;
    }

    const command = new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    await r2Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Generate a presigned URL for temporary private access
 * Useful for sharing designs without making them permanently public
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    if (!r2Client) {
      console.error('❌ R2 client not initialized');
      return null;
    }

    const command = new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('❌ Failed to generate presigned URL:', error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Extract R2 key from a full R2 URL
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    // Match patterns like:
    // https://bucket.account.r2.cloudflarestorage.com/designs/...
    // https://custom-domain.com/designs/...
    const match = url.match(/\/designs\/.+$/);
    return match ? match[0].substring(1) : null; // Remove leading slash
  } catch (error) {
    console.error('Failed to extract key from URL:', error);
    return null;
  }
}

/**
 * Check if R2 storage is properly configured
 */
export function isR2Configured(): boolean {
  return r2Client !== null && missingEnvVars.length === 0;
}

export { r2Client };
