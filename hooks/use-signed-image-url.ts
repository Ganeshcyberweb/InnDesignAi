import { useState, useEffect } from 'react';
import { normalizeR2Url } from '@/lib/r2-storage';

interface UseSignedImageUrlResult {
  signedUrl: string | null;
  loading: boolean;
  error: string | null;
}

export function useSignedImageUrl(originalUrl: string | undefined): UseSignedImageUrlResult {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!originalUrl) {
      setSignedUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    // Normalize URL to fix any double slashes
    const normalizedUrl = normalizeR2Url(originalUrl);

    // If the URL is not an R2 URL, use it directly
    if (!normalizedUrl.includes('r2.cloudflarestorage.com') && !normalizedUrl.includes('r2.dev')) {
      setSignedUrl(normalizedUrl);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchSignedUrl = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/images/signed-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: normalizedUrl }),
        });

        if (!response.ok) {
          throw new Error('Failed to get signed URL');
        }

        const data = await response.json();
        
        if (data.success) {
          setSignedUrl(data.signedUrl);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Error fetching signed URL:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchSignedUrl();
  }, [originalUrl]);

  return { signedUrl, loading, error };
}