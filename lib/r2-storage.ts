import { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

// Validate required environment variables
const requiredEnvVars = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];
const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);

console.log('\n🔧 === R2 Storage Module Initialization ===');
console.log('🔧 Checking environment variables...');

requiredEnvVars.forEach((varName) => {
  const isSet = !!process.env[varName];
  const status = isSet ? '✅' : '❌';
  const value = isSet ? (varName.includes('KEY') || varName.includes('SECRET') ? '[HIDDEN]' : process.env[varName]) : 'NOT_SET';
  console.log(`${status} ${varName}: ${value}`);
});

if (missingEnvVars.length > 0) {
  console.warn(
    `⚠️ Missing R2 environment variables: ${missingEnvVars.join(', ')}. R2 storage will not be available.`
  );
  console.warn('⚠️ Images will be stored as base64 in the database instead.');
} else {
  console.log('✅ All R2 environment variables configured');
  console.log(`✅ R2 endpoint: https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
}

console.log('🔧 === R2 Storage Module Ready ===\n');

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
  console.log(`   🔍 Parsing base64 data URL (length: ${dataUrl.length})...`);
  
  const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    console.error(`   ❌ Invalid base64 data URL format`);
    console.error(`   ❌ Expected format: data:image/[type];base64,[data]`);
    console.error(`   ❌ Received preview: ${dataUrl.substring(0, 100)}...`);
    throw new Error('Invalid base64 data URL format');
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  
  console.log(`   📋 MIME type: ${mimeType}`);
  console.log(`   📋 Base64 data length: ${base64Data.length}`);
  
  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64Data, 'base64');
    console.log(`   ✅ Buffer created: ${buffer.length} bytes`);
  } catch (bufferError) {
    console.error(`   ❌ Failed to create buffer from base64:`, bufferError);
    throw new Error('Failed to decode base64 data');
  }

  // Map MIME type to file extension
  const extensionMap: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
  };

  const extension = extensionMap[mimeType.toLowerCase()] || 'png';
  
  if (!extensionMap[mimeType.toLowerCase()]) {
    console.warn(`   ⚠️ Unknown MIME type: ${mimeType}, defaulting to 'png'`);
  }

  console.log(`   ✅ File extension: ${extension}`);

  return { buffer, mimeType, extension };
}

/**
 * Upload a base64 image to Cloudflare R2 storage
 */
export async function uploadImageToR2(options: UploadImageOptions): Promise<UploadResult> {
  const uploadId = nanoid(8);
  const uploadStart = Date.now();

  console.log(`\n🟡 [R2-${uploadId}] === R2 UPLOAD START ===`);
  console.log(`🟡 [R2-${uploadId}] Options:`, {
    designId: options.designId,
    outputId: options.outputId,
    viewType: options.viewType,
    base64DataLength: options.base64Data?.length || 0,
  });

  try {
    // Check R2 client initialization
    if (!r2Client) {
      console.error(`❌ [R2-${uploadId}] R2 client not initialized`);
      console.error(`❌ [R2-${uploadId}] Missing environment variables:`, missingEnvVars);
      console.error(`❌ [R2-${uploadId}] Required vars: ${requiredEnvVars.join(', ')}`);
      return {
        success: false,
        error: 'R2 storage not configured',
      };
    }

    console.log(`✅ [R2-${uploadId}] R2 client initialized successfully`);
    console.log(`🟡 [R2-${uploadId}] Bucket: ${process.env.R2_BUCKET_NAME}`);
    console.log(`🟡 [R2-${uploadId}] Account: ${process.env.R2_ACCOUNT_ID}`);

    // Parse base64 data
    console.log(`🟡 [R2-${uploadId}] Parsing base64 data...`);
    const parseStart = Date.now();
    
    let buffer: Buffer;
    let mimeType: string;
    let extension: string;
    
    try {
      const parsed = parseBase64DataUrl(options.base64Data);
      buffer = parsed.buffer;
      mimeType = parsed.mimeType;
      extension = parsed.extension;
      
      const parseDuration = Date.now() - parseStart;
      console.log(`✅ [R2-${uploadId}] Base64 parsed successfully (${parseDuration}ms)`);
    } catch (parseError) {
      console.error(`❌ [R2-${uploadId}] Failed to parse base64 data:`, {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        base64Preview: options.base64Data.substring(0, 100) + '...',
      });
      throw parseError;
    }

    const fileSize = buffer.length;
    const fileSizeKB = Math.round(fileSize / 1024);
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);

    console.log(`🟡 [R2-${uploadId}] Image info:`, {
      sizeBytes: fileSize,
      sizeKB: fileSizeKB,
      sizeMB: fileSizeMB,
      mimeType,
      extension,
    });

    // Validate file size (optional: add limits)
    const maxSizeMB = 10;
    if (fileSize > maxSizeMB * 1024 * 1024) {
      console.warn(`⚠️ [R2-${uploadId}] Image exceeds ${maxSizeMB}MB limit: ${fileSizeMB}MB`);
    }

    // Generate unique key with organized structure
    const uniqueId = nanoid(10);
    const key = `designs/${options.designId}/${options.outputId}_${options.viewType}_${uniqueId}.${extension}`;

    console.log(`🟡 [R2-${uploadId}] Generated storage key: ${key}`);

    // Upload to R2
    console.log(`🟡 [R2-${uploadId}] Uploading to R2...`);
    const s3UploadStart = Date.now();

    try {
      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        ContentLength: fileSize,
        CacheControl: 'public, max-age=31536000, immutable', // 1 year cache
      });

      await r2Client.send(command);

      const s3UploadDuration = Date.now() - s3UploadStart;
      console.log(`✅ [R2-${uploadId}] S3 upload complete (${s3UploadDuration}ms)`);

    } catch (s3Error) {
      const s3UploadDuration = Date.now() - s3UploadStart;
      console.error(`❌ [R2-${uploadId}] S3 upload failed (${s3UploadDuration}ms):`, {
        error: s3Error instanceof Error ? s3Error.message : 'Unknown error',
        errorName: s3Error instanceof Error ? s3Error.name : undefined,
        errorStack: s3Error instanceof Error ? s3Error.stack : undefined,
        bucket: process.env.R2_BUCKET_NAME,
        key,
      });
      throw s3Error;
    }

    // Construct public URL
    const publicUrl = process.env.R2_PUBLIC_URL
      ? `${process.env.R2_PUBLIC_URL}/${key}`
      : `https://${process.env.R2_BUCKET_NAME}.${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${key}`;

    console.log(`🟡 [R2-${uploadId}] Public URL generated:`, publicUrl);

    const uploadDuration = Date.now() - uploadStart;
    console.log(`✅ [R2-${uploadId}] === R2 UPLOAD COMPLETE === (${uploadDuration}ms)\n`);

    return {
      success: true,
      url: publicUrl,
      key,
    };
  } catch (error) {
    const uploadDuration = Date.now() - uploadStart;
    console.error(`❌ [R2-${uploadId}] === R2 UPLOAD FAILED === (${uploadDuration}ms)`);
    console.error(`❌ [R2-${uploadId}] Error details:`, {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : undefined,
      stack: error instanceof Error ? error.stack : undefined,
      uploadId,
      designId: options.designId,
      outputId: options.outputId,
      viewType: options.viewType,
    });

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
  const deleteId = nanoid(8);
  console.log(`\n🟠 [DEL-${deleteId}] === R2 DELETE START ===`);
  console.log(`🟠 [DEL-${deleteId}] Key: ${key}`);
  
  try {
    if (!r2Client) {
      console.error(`❌ [DEL-${deleteId}] R2 client not initialized`);
      return false;
    }

    console.log(`� [DEL-${deleteId}] Sending delete command...`);
    const deleteStart = Date.now();

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    await r2Client.send(command);

    const deleteDuration = Date.now() - deleteStart;
    console.log(`✅ [DEL-${deleteId}] Delete successful (${deleteDuration}ms)`);
    console.log(`✅ [DEL-${deleteId}] === R2 DELETE COMPLETE ===\n`);

    return true;
  } catch (error) {
    console.error(`❌ [DEL-${deleteId}] R2 delete failed:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      key,
      bucket: process.env.R2_BUCKET_NAME,
    });
    return false;
  }
}

/**
 * Check if an image exists in R2 storage
 */
export async function imageExistsInR2(key: string): Promise<boolean> {
  const checkId = nanoid(8);
  console.log(`🔍 [CHK-${checkId}] Checking if image exists: ${key}`);
  
  try {
    if (!r2Client) {
      console.error(`❌ [CHK-${checkId}] R2 client not initialized`);
      return false;
    }

    const command = new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    await r2Client.send(command);
    console.log(`✅ [CHK-${checkId}] Image exists`);
    return true;
  } catch (error) {
    console.log(`ℹ️ [CHK-${checkId}] Image does not exist or error occurred:`, 
      error instanceof Error ? error.message : 'Unknown error'
    );
    return false;
  }
}

/**
 * Generate a presigned URL for temporary private access
 * Useful for sharing designs without making them permanently public
 */
export async function getPresignedUrl(key: string, expiresIn: number = 3600): Promise<string | null> {
  const signId = nanoid(8);
  console.log(`\n🔐 [SIGN-${signId}] === PRESIGNED URL GENERATION START ===`);
  console.log(`🔐 [SIGN-${signId}] Key: ${key}`);
  console.log(`🔐 [SIGN-${signId}] Expires in: ${expiresIn}s (${Math.round(expiresIn / 60)}m)`);
  
  try {
    if (!r2Client) {
      console.error(`❌ [SIGN-${signId}] R2 client not initialized`);
      return null;
    }

    const signStart = Date.now();

    const command = new HeadObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    
    const signDuration = Date.now() - signStart;
    console.log(`✅ [SIGN-${signId}] Presigned URL generated (${signDuration}ms)`);
    console.log(`✅ [SIGN-${signId}] === PRESIGNED URL COMPLETE ===\n`);
    
    return signedUrl;
  } catch (error) {
    console.error(`❌ [SIGN-${signId}] Failed to generate presigned URL:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      key,
      expiresIn,
    });
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
