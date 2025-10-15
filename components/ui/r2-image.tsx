"use client";

import { useSignedImageUrl } from '@/hooks/use-signed-image-url';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle } from 'lucide-react';

interface R2ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt: string;
  fallback?: React.ReactNode;
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export function R2Image({ src, alt, fallback, onError, className, ...props }: R2ImageProps) {
  const { signedUrl, loading, error } = useSignedImageUrl(src);

  if (loading) {
    return <Skeleton className={className} />;
  }

  if (error && !signedUrl) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <AlertTriangle className="w-6 h-6" />
          <span className="text-xs text-center">Image unavailable</span>
        </div>
      </div>
    );
  }

  const handleError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image load error:', { originalSrc: src, signedUrl, error });
    onError?.(event);
  };

  return (
    <img
      {...props}
      src={signedUrl || src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}