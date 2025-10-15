import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

/**
 * Generate a signed URL for an R2 object
 */
export async function getSignedImageUrl(key: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    if (!r2Client || !process.env.R2_BUCKET_NAME) {
      console.error('❌ R2 client or bucket name not configured');
      return null;
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('❌ Error generating signed URL:', error);
    return null;
  }
}

/**
 * Extract the key from an R2 URL
 */
export function extractKeyFromR2Url(url: string): string | null {
  try {
    // Handle both formats:
    // https://bucket.account.r2.cloudflarestorage.com/path/to/file
    // https://custom-domain.com/path/to/file
    const urlObj = new URL(url);
    
    // Remove leading slash and return the path as key
    return urlObj.pathname.substring(1);
  } catch (error) {
    console.error('❌ Error extracting key from URL:', url, error);
    return null;
  }
}