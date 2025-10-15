import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Design, DesignOutput } from '@/lib/generated/prisma';

// Types
interface DesignWithChain extends Design {
  chainLength?: number;
  isRoot?: boolean;
  designOutputs?: DesignOutput[];
}

interface DesignWithOutputs extends Design {
  outputs?: DesignOutput[];
  designOutputs?: DesignOutput[];
}

interface RegenerationStats {
  totalRegenerations: number;
  rootDesignId: string | null;
  latestDesignId: string | null;
  generationNumbers: number[];
  createdDates: Date[];
}

interface CacheMetadata {
  timestamp: number;
  ttl: number;
}

interface DesignHistoryState {
  // Data storage
  designs: Record<string, DesignWithChain>;
  chains: Record<string, DesignWithOutputs[]>;
  stats: Record<string, RegenerationStats>;

  // Cache metadata
  allDesignsCache: CacheMetadata | null;
  chainCache: Record<string, CacheMetadata>;

  // Loading states
  isLoadingAll: boolean;
  isLoadingChain: Record<string, boolean>;

  // Error states
  errors: Record<string, string | null>;

  // Actions
  fetchAllDesigns: (force?: boolean) => Promise<void>;
  fetchDesignChain: (designId: string, force?: boolean) => Promise<void>;
  addNewDesign: (design: Design) => void;
  updateDesign: (designId: string, updates: Partial<Design>) => void;
  addRegeneratedDesign: (originalDesignId: string, newDesign: Design) => void;
  invalidateCache: () => void;
  invalidateChainCache: (designId: string) => void;
  clearError: (key: string) => void;
  refreshIfStale: () => Promise<void>;

  // Selectors
  getAllDesigns: () => DesignWithChain[];
  getDesign: (designId: string) => DesignWithChain | null;
  getChain: (designId: string) => DesignWithOutputs[] | null;
  getStats: (designId: string) => RegenerationStats | null;
  isCacheValid: (cacheKey: 'all' | string) => boolean;
  getLastFetchTime: () => number | null;
}

// Cache TTL configuration (in milliseconds)
const CACHE_TTL = {
  ALL_DESIGNS: 15 * 60 * 1000, // 15 minutes - more aggressive caching for history page
  DESIGN_CHAIN: 30 * 60 * 1000, // 30 minutes - chains don't change frequently
};

// Helper function to check cache validity
const isCacheValid = (cache: CacheMetadata | null | undefined): boolean => {
  if (!cache) return false;
  const now = Date.now();
  return now - cache.timestamp < cache.ttl;
};

export const useDesignHistoryStore = create<DesignHistoryState>()(
  persist(
    (set, get) => ({
      // Initial state
      designs: {},
      chains: {},
      stats: {},
      allDesignsCache: null,
      chainCache: {},
      isLoadingAll: false,
      isLoadingChain: {},
      errors: {},

      // Fetch all designs with smart caching
      fetchAllDesigns: async (force = false) => {
        const state = get();

        // Check cache validity unless force refresh
        if (!force && state.allDesignsCache && isCacheValid(state.allDesignsCache)) {
          console.log('📦 Using cached designs (fresh) - No API calls needed');
          return;
        }

        console.log('🔄 Fetching all designs from API...');
        set({ isLoadingAll: true, errors: { ...state.errors, all: null } });

        try {
          const response = await fetch('/api/designs');
          console.log('📡 API Response:', { status: response.status, ok: response.ok });

          if (!response.ok) {
            const errorData = await response.json();
            console.log('❌ API Error:', errorData);
            throw new Error(errorData.error || 'Failed to fetch designs');
          }

          const data = await response.json();
          console.log('📊 API Success:', { success: data.success, designCount: data.designs?.length });

          if (data.success) {
            // Process all designs and calculate chain lengths efficiently
            console.log('📋 Raw API data structure:', data.designs?.[0]);
            const allDesigns = data.designs as (Design & { outputs?: DesignOutput[]; designOutputs?: DesignOutput[] })[];
            
            // Group designs by root design ID
            const designGroups = new Map<string, (Design & { outputs?: DesignOutput[]; designOutputs?: DesignOutput[] })[]>();
            
            allDesigns.forEach((design) => {
              // Find root design ID (traverse up the parent chain)
              let rootId = design.id;
              
              // Simple approach: use the design without parent as root
              if (!design.parentId) {
                rootId = design.id;
              } else {
                // Find designs that share the same parent chain
                const parent = allDesigns.find(d => d.id === design.parentId);
                if (parent && !parent.parentId) {
                  rootId = parent.id;
                } else {
                  // For complex chains, use the design itself as fallback
                  rootId = design.id;
                }
              }
              
              if (!designGroups.has(rootId)) {
                designGroups.set(rootId, []);
              }
              designGroups.get(rootId)!.push(design);
            });

            // Create designs with chain info
            const designsRecord: Record<string, DesignWithChain> = {};
            
            designGroups.forEach((designsInChain, rootId) => {
              // Sort by generation number or creation date
              designsInChain.sort((a, b) => {
                if (a.generationNumber && b.generationNumber) {
                  return a.generationNumber - b.generationNumber;
                }
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              });
              
              const rootDesign = designsInChain.find(d => d.id === rootId || !d.parentId) || designsInChain[0];
              
              designsRecord[rootId] = {
                ...rootDesign,
                chainLength: designsInChain.length,
                isRoot: true,
                designOutputs: rootDesign.outputs || rootDesign.designOutputs,
              };
            });

            set({
              designs: designsRecord,
              allDesignsCache: {
                timestamp: Date.now(),
                ttl: CACHE_TTL.ALL_DESIGNS,
              },
              isLoadingAll: false,
            });

            console.log(`✅ Fetched ${Object.keys(designsRecord).length} design chains (cached for 15 minutes) - No additional API calls made`);
          } else {
            throw new Error(data.error || 'Failed to fetch designs');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          console.error('❌ Error fetching designs:', err);
          set({
            errors: { ...get().errors, all: errorMessage },
            isLoadingAll: false,
          });
        }
      },

      // Fetch design chain with smart caching
      fetchDesignChain: async (designId: string, force = false) => {
        const state = get();

        // Check cache validity unless force refresh
        const chainCacheEntry = state.chainCache[designId];
        if (!force && chainCacheEntry && isCacheValid(chainCacheEntry)) {
          console.log(`📦 Using cached chain for ${designId.slice(0, 8)} (fresh)`);
          return;
        }

        console.log(`🔄 Fetching chain for design ${designId.slice(0, 8)}...`);
        set({
          isLoadingChain: { ...state.isLoadingChain, [designId]: true },
          errors: { ...state.errors, [designId]: null },
        });

        try {
          const response = await fetch(`/api/designs/${designId}/chain`);

          if (!response.ok) {
            throw new Error('Failed to fetch design chain');
          }

          const data = await response.json();

          if (data.success) {
            console.log('📋 Raw chain data structure:', data.chain?.[0]);
            
            // Transform the chain data to ensure outputs are mapped to designOutputs
            const transformedChain = data.chain.map((design: any) => {
              const designOutputs = design.outputs || design.designOutputs || [];
              console.log(`🔍 Design ${design.id.slice(0, 8)} has ${designOutputs.length} outputs`);
              return {
                ...design,
                designOutputs,
              };
            });

            set({
              chains: {
                ...get().chains,
                [designId]: transformedChain,
              },
              stats: {
                ...get().stats,
                [designId]: data.stats,
              },
              chainCache: {
                ...get().chainCache,
                [designId]: {
                  timestamp: Date.now(),
                  ttl: CACHE_TTL.DESIGN_CHAIN,
                },
              },
              isLoadingChain: {
                ...get().isLoadingChain,
                [designId]: false,
              },
            });

            console.log(`✅ Fetched chain for ${designId.slice(0, 8)} (${data.chain.length} items, cached for 10 minutes)`);
          } else {
            throw new Error(data.error || 'Failed to fetch design chain');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An error occurred';
          console.error(`❌ Error fetching chain for ${designId}:`, err);
          set({
            errors: {
              ...get().errors,
              [designId]: errorMessage,
            },
            isLoadingChain: {
              ...get().isLoadingChain,
              [designId]: false,
            },
          });
        }
      },

      // Add a newly created design to the store
      addNewDesign: (design: Design) => {
        const state = get();
        console.log('➕ Adding new design to store:', design.id.slice(0, 8));

        const designWithChain: DesignWithChain = {
          ...design,
          chainLength: 1,
          isRoot: true,
        };

        set({
          designs: {
            ...state.designs,
            [design.id]: designWithChain,
          },
          // Update cache timestamp to extend validity
          allDesignsCache: state.allDesignsCache ? {
            ...state.allDesignsCache,
            timestamp: Date.now(), // Refresh timestamp since we added new data
          } : null,
        });

        console.log('✅ Design added to cache, extending cache validity');
      },

      // Add a regenerated design (updates chain length without full cache invalidation)
      addRegeneratedDesign: (originalDesignId: string, newDesign: Design) => {
        const state = get();
        console.log('🔄 Adding regenerated design for:', originalDesignId.slice(0, 8));

        // Find the root design to update its chain length
        const rootDesign = state.designs[originalDesignId];
        if (rootDesign) {
          set({
            designs: {
              ...state.designs,
              [originalDesignId]: {
                ...rootDesign,
                chainLength: (rootDesign.chainLength || 1) + 1,
              },
            },
            // Extend cache validity since we have fresh data
            allDesignsCache: state.allDesignsCache ? {
              ...state.allDesignsCache,
              timestamp: Date.now(),
            } : null,
          });

          // Invalidate the specific chain cache since it has changed
          get().invalidateChainCache(originalDesignId);
          
          console.log('✅ Updated chain length and extended cache validity');
        }
      },

      // Update an existing design
      updateDesign: (designId: string, updates: Partial<Design>) => {
        const state = get();
        const existingDesign = state.designs[designId];

        if (existingDesign) {
          set({
            designs: {
              ...state.designs,
              [designId]: {
                ...existingDesign,
                ...updates,
              },
            },
          });
        }
      },

      // Invalidate all caches (force refresh on next fetch)
      invalidateCache: () => {
        console.log('🗑️ Invalidating all caches');
        set({
          allDesignsCache: null,
          chainCache: {},
        });
      },

      // Invalidate specific chain cache
      invalidateChainCache: (designId: string) => {
        console.log(`🗑️ Invalidating cache for chain ${designId.slice(0, 8)}`);
        const state = get();
        const newChainCache = { ...state.chainCache };
        delete newChainCache[designId];

        set({
          chainCache: newChainCache,
        });
      },

      // Clear error for a specific key
      clearError: (key: string) => {
        const state = get();
        const newErrors = { ...state.errors };
        delete newErrors[key];
        set({ errors: newErrors });
      },

      // Selectors
      getAllDesigns: () => {
        const state = get();
        return Object.values(state.designs).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      getDesign: (designId: string) => {
        const state = get();
        return state.designs[designId] || null;
      },

      getChain: (designId: string) => {
        const state = get();
        return state.chains[designId] || null;
      },

      getStats: (designId: string) => {
        const state = get();
        return state.stats[designId] || null;
      },

      isCacheValid: (cacheKey: 'all' | string) => {
        const state = get();
        if (cacheKey === 'all') {
          return isCacheValid(state.allDesignsCache);
        }
        return isCacheValid(state.chainCache[cacheKey]);
      },

      getLastFetchTime: () => {
        const state = get();
        return state.allDesignsCache?.timestamp || null;
      },

      // Smart refresh - only fetch if cache is stale or empty
      refreshIfStale: async () => {
        const state = get();
        const hasValidCache = state.allDesignsCache && isCacheValid(state.allDesignsCache);
        const hasDesigns = Object.keys(state.designs).length > 0;
        
        // Only fetch if we don't have valid cache or no designs at all
        if (!hasValidCache || !hasDesigns) {
          console.log('🔄 Cache is stale or empty, refreshing from database...');
          await get().fetchAllDesigns(false);
        } else {
          const cacheAge = Date.now() - (state.allDesignsCache?.timestamp || 0);
          const minutesOld = Math.floor(cacheAge / (1000 * 60));
          console.log(`📦 Using cached data (${minutesOld}m old) - No database queries needed`);
        }
      },
    }),
    {
      name: 'design-history-storage',
      // Only persist the data, not loading/error states
      partialize: (state) => ({
        designs: state.designs,
        chains: state.chains,
        stats: state.stats,
        allDesignsCache: state.allDesignsCache,
        chainCache: state.chainCache,
      }),
    }
  )
);
