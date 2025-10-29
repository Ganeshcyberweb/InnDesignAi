import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

// Initialize R2 client
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

console.log('🔧 R2 Signed URLs module initialized:', {
  clientConfigured: !!r2Client,
  bucketName: process.env.R2_BUCKET_NAME || 'NOT_SET',
  accountId: process.env.R2_ACCOUNT_ID || 'NOT_SET',
});

/**
 * Generate a signed URL for an R2 object
 */
export async function getSignedImageUrl(key: string, expiresIn: number = 3600): Promise<string | null> {
  const signId = nanoid(8);
  console.log(`\n🔑 [SIGN-${signId}] === SIGNED URL REQUEST START ===`);
  console.log(`🔑 [SIGN-${signId}] Key: ${key}`);
  console.log(`🔑 [SIGN-${signId}] Expires in: ${expiresIn}s (${Math.round(expiresIn / 60)}m)`);
  
  try {
    if (!r2Client || !process.env.R2_BUCKET_NAME) {
      console.error(`❌ [SIGN-${signId}] R2 client or bucket name not configured`);
      console.error(`❌ [SIGN-${signId}] Client exists: ${!!r2Client}`);
      console.error(`❌ [SIGN-${signId}] Bucket name: ${process.env.R2_BUCKET_NAME || 'NOT_SET'}`);
      return null;
    }

    console.log(`🔑 [SIGN-${signId}] Generating signed URL...`);
    const signStart = Date.now();

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    
    const signDuration = Date.now() - signStart;
    console.log(`✅ [SIGN-${signId}] Signed URL generated successfully (${signDuration}ms)`);
    console.log(`✅ [SIGN-${signId}] URL length: ${signedUrl.length}`);
    console.log(`✅ [SIGN-${signId}] === SIGNED URL REQUEST COMPLETE ===\n`);
    
    return signedUrl;
  } catch (error) {
    console.error(`❌ [SIGN-${signId}] Error generating signed URL:`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      errorName: error instanceof Error ? error.name : undefined,
      key,
      bucket: process.env.R2_BUCKET_NAME,
    });
    return null;
  }
}

/**
 * Extract the key from an R2 URL
 */
export function extractKeyFromR2Url(url: string): string | null {
  console.log(`🔍 Extracting key from URL: ${url}`);
  
  try {
    // Handle both formats:
    // https://bucket.account.r2.cloudflarestorage.com/path/to/file
    // https://custom-domain.com/path/to/file
    const urlObj = new URL(url);
    
    // Remove leading slash and return the path as key
    const key = urlObj.pathname.substring(1);
    console.log(`✅ Extracted key: ${key}`);
    return key;
  } catch (error) {
    console.error(`❌ Error extracting key from URL:`, {
      url,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return null;
  }
}