import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { key } = await params;
    const objectKey = key.join('/');

    if (!r2Client || !process.env.R2_BUCKET_NAME) {
      return NextResponse.json(
        { error: 'R2 storage not configured' },
        { status: 500 }
      );
    }

    console.log(`📸 Serving image: ${objectKey}`);

    // Get object from R2
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: objectKey,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      );
    }

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    const stream = response.Body as any;
    
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    
    const buffer = Buffer.concat(chunks);

    // Return image with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': response.ContentType || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json(
      { error: 'Failed to serve image' },
      { status: 500 }
    );
  }
}