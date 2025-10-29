"use client";

import { useState, useCallback } from "react";

export interface ImageUploadProgress {
  index: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  key?: string;
  error?: string;
}

export interface BatchUploadResult {
  success: boolean;
  uploadedUrls: (string | null)[];
  errors: (string | null)[];
  failedIndices: number[];
}

interface UseBatchImageUploadReturn {
  uploadImages: (base64Images: string[], viewType?: string) => Promise<BatchUploadResult>;
  progress: ImageUploadProgress[];
  isUploading: boolean;
  overallProgress: number;
}

/**
 * Hook for batch uploading images to R2 storage
 * Uploads images in parallel with configurable concurrency
 * Provides progress tracking and error handling with retry logic
 */
export function useBatchImageUpload(): UseBatchImageUploadReturn {
  const [progress, setProgress] = useState<ImageUploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  /**
   * Upload a single image with retry logic
   */
  const uploadSingleImage = async (
    base64Data: string,
    index: number,
    viewType: string = 'variation',
    maxRetries: number = 3
  ): Promise<{ url: string | null; key: string | null; error: string | null }> => {
    let lastError: string | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`📤 Uploading image ${index + 1} (attempt ${attempt + 1}/${maxRetries})...`);

        // Update progress to uploading
        setProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index] = {
            ...newProgress[index],
            status: 'uploading',
            progress: 10 + (attempt * 10), // Show retry progress
          };
          return newProgress;
        });

        const response = await fetch('/api/designs/upload-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            base64Data, 
            viewType 
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Upload failed with status ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.url) {
          console.log(`✅ Image ${index + 1} uploaded successfully: ${result.key}`);
          
          // Update progress to success
          setProgress((prev) => {
            const newProgress = [...prev];
            newProgress[index] = {
              ...newProgress[index],
              status: 'success',
              progress: 100,
              url: result.url,
              key: result.key,
            };
            return newProgress;
          });

          return { url: result.url, key: result.key, error: null };
        } else {
          throw new Error(result.error || 'Upload failed - no URL returned');
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.warn(`⚠️ Image ${index + 1} upload attempt ${attempt + 1} failed:`, lastError);

        // If not the last attempt, wait before retrying (exponential backoff)
        if (attempt < maxRetries - 1) {
          const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
          console.log(`⏳ Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }

    // All retries failed
    console.error(`❌ Image ${index + 1} upload failed after ${maxRetries} attempts:`, lastError);
    
    setProgress((prev) => {
      const newProgress = [...prev];
      newProgress[index] = {
        ...newProgress[index],
        status: 'error',
        progress: 0,
        error: lastError || 'Upload failed',
      };
      return newProgress;
    });

    return { url: null, key: null, error: lastError };
  };

  /**
   * Upload multiple images in parallel with controlled concurrency
   */
  const uploadImages = useCallback(async (
    base64Images: string[],
    viewType: string = 'variation'
  ): Promise<BatchUploadResult> => {
    setIsUploading(true);
    setOverallProgress(0);

    // Initialize progress tracking
    const initialProgress: ImageUploadProgress[] = base64Images.map((_, index) => ({
      index,
      status: 'pending',
      progress: 0,
    }));
    setProgress(initialProgress);

    console.log(`\n🚀 === BATCH IMAGE UPLOAD START ===`);
    console.log(`📊 Total images to upload: ${base64Images.length}`);
    console.log(`🔧 View type: ${viewType}`);

    const startTime = Date.now();
    const uploadedUrls: (string | null)[] = [];
    const errors: (string | null)[] = [];
    const failedIndices: number[] = [];

    // Upload with controlled concurrency (3 at a time to avoid overwhelming the server)
    const concurrency = 3;
    const chunks: number[][] = [];
    
    for (let i = 0; i < base64Images.length; i += concurrency) {
      chunks.push(Array.from({ length: Math.min(concurrency, base64Images.length - i) }, (_, j) => i + j));
    }

    console.log(`📦 Split into ${chunks.length} chunks of up to ${concurrency} images`);

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      console.log(`\n📤 Processing chunk ${chunkIndex + 1}/${chunks.length} (images: ${chunk.map(i => i + 1).join(', ')})`);

      // Upload chunk in parallel
      const chunkResults = await Promise.all(
        chunk.map((imageIndex) =>
          uploadSingleImage(base64Images[imageIndex], imageIndex, viewType)
        )
      );

      // Process results
      chunkResults.forEach((result, i) => {
        const imageIndex = chunk[i];
        uploadedUrls[imageIndex] = result.url;
        errors[imageIndex] = result.error;
        
        if (result.error) {
          failedIndices.push(imageIndex);
        }
      });

      // Update overall progress
      const completed = uploadedUrls.filter(url => url !== null && url !== undefined).length;
      const newOverallProgress = Math.round((completed / base64Images.length) * 100);
      setOverallProgress(newOverallProgress);
      
      console.log(`📊 Progress: ${completed}/${base64Images.length} images uploaded (${newOverallProgress}%)`);

      // Small delay between chunks to avoid rate limiting
      if (chunkIndex < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const totalDuration = Date.now() - startTime;
    const successCount = uploadedUrls.filter(url => url !== null).length;
    const failureCount = failedIndices.length;

    console.log(`\n✅ === BATCH IMAGE UPLOAD COMPLETE ===`);
    console.log(`⏱️ Duration: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`✅ Successful: ${successCount}/${base64Images.length}`);
    if (failureCount > 0) {
      console.log(`❌ Failed: ${failureCount} (indices: ${failedIndices.join(', ')})`);
    }

    setIsUploading(false);

    return {
      success: failureCount === 0,
      uploadedUrls,
      errors,
      failedIndices,
    };
  }, []);

  return {
    uploadImages,
    progress,
    isUploading,
    overallProgress,
  };
}
