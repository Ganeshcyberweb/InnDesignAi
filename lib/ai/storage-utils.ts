import { createClient } from '@supabase/supabase-js';

export interface StorageUploadResult {
  success: boolean;
  publicUrl?: string;
  fileName?: string;
  error?: string;
}

export class DesignStorageManager {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async uploadDesignImage(
    designId: string,
    imageUrl: string,
    variationIndex: number,
    isRegeneration: boolean = false
  ): Promise<StorageUploadResult> {
    try {
      // Fetch the image from the AI provider URL
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }

      const imageBuffer = await imageResponse.arrayBuffer();

      // Generate unique filename
      const timestamp = Date.now();
      const prefix = isRegeneration ? 'regenerated' : 'output';
      const fileName = `designs/${designId}/${prefix}_${variationIndex + 1}_${timestamp}.jpg`;

      // Upload to Supabase Storage
      const { data, error } = await this.supabase.storage
        .from('design-images')
        .upload(fileName, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) {
        console.error('Supabase storage error:', error);
        return {
          success: false,
          error: `Storage upload failed: ${error.message}`,
        };
      }

      // Get public URL
      const { data: { publicUrl } } = this.supabase.storage
        .from('design-images')
        .getPublicUrl(fileName);

      return {
        success: true,
        publicUrl,
        fileName,
      };

    } catch (error: any) {
      console.error('Error uploading design image:', error);
      return {
        success: false,
        error: error.message || 'Unknown upload error',
      };
    }
  }

  async uploadMultipleDesignImages(
    designId: string,
    imageUrls: string[],
    isRegeneration: boolean = false
  ): Promise<StorageUploadResult[]> {
    const uploadPromises = imageUrls.map((url, index) =>
      this.uploadDesignImage(designId, url, index, isRegeneration)
    );

    return Promise.all(uploadPromises);
  }

  async deleteDesignImage(fileName: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from('design-images')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  async deleteAllDesignImages(designId: string): Promise<boolean> {
    try {
      // List all files for the design
      const { data: files, error: listError } = await this.supabase.storage
        .from('design-images')
        .list(`designs/${designId}`);

      if (listError) {
        console.error('Error listing files:', listError);
        return false;
      }

      if (!files || files.length === 0) {
        return true; // No files to delete
      }

      // Delete all files
      const filePaths = files.map(file => `designs/${designId}/${file.name}`);
      const { error: deleteError } = await this.supabase.storage
        .from('design-images')
        .remove(filePaths);

      if (deleteError) {
        console.error('Error deleting files:', deleteError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting design images:', error);
      return false;
    }
  }

  async createBucket(): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage.createBucket('design-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 10485760, // 10MB
      });

      if (error && error.message !== 'Bucket already exists') {
        console.error('Error creating bucket:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error creating bucket:', error);
      return false;
    }
  }

  async getBucketInfo(): Promise<any> {
    try {
      const { data, error } = await this.supabase.storage.getBucket('design-images');

      if (error) {
        console.error('Error getting bucket info:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error getting bucket info:', error);
      return null;
    }
  }

  // Utility to extract file path from public URL
  extractFilePathFromUrl(publicUrl: string): string | null {
    try {
      const url = new URL(publicUrl);
      const pathSegments = url.pathname.split('/');
      // Remove '/storage/v1/object/public/design-images/' to get the file path
      const bucketIndex = pathSegments.indexOf('design-images');
      if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
        return pathSegments.slice(bucketIndex + 1).join('/');
      }
      return null;
    } catch (error) {
      console.error('Error extracting file path from URL:', error);
      return null;
    }
  }

  // Generate optimized image URLs with transformations
  getOptimizedImageUrl(publicUrl: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  } = {}): string {
    try {
      const url = new URL(publicUrl);
      const params = new URLSearchParams();

      if (options.width) params.append('width', options.width.toString());
      if (options.height) params.append('height', options.height.toString());
      if (options.quality) params.append('quality', options.quality.toString());
      if (options.format) params.append('format', options.format);

      if (params.toString()) {
        url.search = params.toString();
      }

      return url.toString();
    } catch (error) {
      console.error('Error generating optimized URL:', error);
      return publicUrl; // Return original URL if optimization fails
    }
  }
}