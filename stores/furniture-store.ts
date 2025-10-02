import { create } from 'zustand';
import type { FurnitureProduct } from '@/types/furniture';
import { furnitureApi } from '@/lib/services/furniture-api';

interface FurnitureState {
  suggestedItems: FurnitureProduct[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;

  // Actions
  fetchSuggestedItems: (roomType?: string, limit?: number) => Promise<void>;
  loadMoreItems: (roomType?: string, additionalLimit?: number) => Promise<void>;
  clearError: () => void;
  refreshSuggestedItems: () => Promise<void>;
}

export const useFurnitureStore = create<FurnitureState>((set, get) => ({
  suggestedItems: [],
  loading: false,
  loadingMore: false,
  error: null,
  hasMore: true,

  fetchSuggestedItems: async (roomType?: string, limit: number = 4) => {
    console.log(`🛋️ Fetching suggested items - roomType: ${roomType || 'any'}, limit: ${limit}`);
    set({ loading: true, error: null, hasMore: true });

    try {
      let items: FurnitureProduct[];

      if (roomType) {
        console.log(`🏠 Fetching products for room type: ${roomType}`);
        items = await furnitureApi.getProductsForRoom(roomType, limit);
      } else {
        console.log('🎲 Fetching random products');
        items = await furnitureApi.getRandomProducts(limit);
      }

      console.log(`✅ Store: Successfully fetched ${items.length} suggested items`);
      console.log('📦 First few items:', items.slice(0, 2).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category
      })));

      set({
        suggestedItems: items,
        loading: false,
        hasMore: items.length === limit // If we got fewer items than requested, no more available
      });
    } catch (error) {
      console.error('❌ Store: Failed to fetch suggested items:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch suggested items';
      console.error('📝 Error details:', { errorMessage, roomType, limit });

      set({
        error: errorMessage,
        loading: false
      });
    }
  },

  loadMoreItems: async (roomType?: string, additionalLimit: number = 4) => {
    const { suggestedItems, loadingMore } = get();

    if (loadingMore) return; // Prevent multiple simultaneous loads

    set({ loadingMore: true, error: null });

    try {
      let newItems: FurnitureProduct[];

      if (roomType) {
        newItems = await furnitureApi.getProductsForRoom(roomType, additionalLimit);
      } else {
        newItems = await furnitureApi.getRandomProducts(additionalLimit);
      }

      // Filter out any duplicates based on ID
      const existingIds = new Set(suggestedItems.map(item => item.id));
      const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));

      set({
        suggestedItems: [...suggestedItems, ...uniqueNewItems],
        loadingMore: false,
        hasMore: uniqueNewItems.length === additionalLimit // If we got fewer unique items, no more available
      });
    } catch (error) {
      console.error('Failed to load more items:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load more items',
        loadingMore: false
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },

  refreshSuggestedItems: async () => {
    const { suggestedItems } = get();
    // Clear cache and fetch new items
    furnitureApi.clearCache();
    await get().fetchSuggestedItems(undefined, suggestedItems.length || 4);
  }
}));