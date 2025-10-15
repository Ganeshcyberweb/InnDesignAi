import { useState, useEffect } from 'react';

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

    // If the URL is not an R2 URL, use it directly
    if (!originalUrl.includes('r2.cloudflarestorage.com')) {
      setSignedUrl(originalUrl);
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
          body: JSON.stringify({ imageUrl: originalUrl }),
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