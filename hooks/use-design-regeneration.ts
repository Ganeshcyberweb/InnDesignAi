"use client";

import { useState, useCallback } from "react";
import type { Design, DesignOutput } from "@/lib/generated/prisma";

interface DesignWithOutputs extends Design {
  designOutputs?: DesignOutput[];
}

interface RegenerationStats {
  totalRegenerations: number;
  rootDesignId: string | null;
  latestDesignId: string | null;
  generationNumbers: number[];
  createdDates: Date[];
}

interface UseDesignRegenerationReturn {
  chain: DesignWithOutputs[];
  stats: RegenerationStats | null;
  isLoading: boolean;
  error: string | null;
  fetchChain: (designId: string) => Promise<void>;
  createRegeneration: (
    parentDesignId: string,
    inputPrompt: string,
    aiModelUsed: string,
    uploadedImageUrl?: string
  ) => Promise<Design | null>;
  isRegenerating: boolean;
}

export function useDesignRegeneration(): UseDesignRegenerationReturn {
  const [chain, setChain] = useState<DesignWithOutputs[]>([]);
  const [stats, setStats] = useState<RegenerationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const fetchChain = useCallback(async (designId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/designs/${designId}/chain`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch design chain');
      }

      const data = await response.json();
      
      if (data.success) {
        setChain(data.chain);
        setStats(data.stats);
      } else {
        throw new Error(data.error || 'Failed to fetch design chain');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching design chain:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRegeneration = useCallback(async (
    parentDesignId: string,
    inputPrompt: string,
    aiModelUsed: string,
    uploadedImageUrl?: string
  ): Promise<Design | null> => {
    setIsRegenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/designs/regenerate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentDesignId,
          inputPrompt,
          aiModelUsed,
          uploadedImageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create regeneration');
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh the chain to include the new regeneration
        await fetchChain(data.design.id);
        return data.design;
      } else {
        throw new Error(data.error || 'Failed to create regeneration');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error creating regeneration:', err);
      return null;
    } finally {
      setIsRegenerating(false);
    }
  }, [fetchChain]);

  return {
    chain,
    stats,
    isLoading,
    error,
    fetchChain,
    createRegeneration,
    isRegenerating,
  };
}
