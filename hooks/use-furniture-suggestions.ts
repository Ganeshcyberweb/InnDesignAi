import { useState, useEffect, useRef } from 'react';
import { furnitureApi } from '@/lib/services/furniture-api';
import { parseBudgetRange } from '@/lib/utils/budget-parser';
import { ROOM_FURNITURE_MAPPING } from '@/types/furniture';
import type { FurnitureProduct, FurnitureFilters } from '@/types/furniture';

interface UseFurnitureSuggestionsProps {
  budgetRange?: string;
  roomType?: string;
  limit?: number;
}

interface UseFurnitureSuggestionsReturn {
  products: FurnitureProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFurnitureSuggestions({
  budgetRange,
  roomType,
  limit = 12
}: UseFurnitureSuggestionsProps = {}): UseFurnitureSuggestionsReturn {
  const [products, setProducts] = useState<FurnitureProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRoomTypeRef = useRef<string | undefined>(undefined);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Clear cache if room type changed to ensure fresh data
      if (lastRoomTypeRef.current !== roomType) {
        furnitureApi.clearCache();
      }

      // Parse budget range
      const { min, max } = parseBudgetRange(budgetRange || '');

      console.log(`🔍 Fetching furniture for room type: ${roomType || 'all'}`);

      let allProducts: FurnitureProduct[] = [];

      // If we have a room type, fetch products for each relevant category
      if (roomType && roomType in ROOM_FURNITURE_MAPPING) {
        const relevantCategories = ROOM_FURNITURE_MAPPING[roomType as keyof typeof ROOM_FURNITURE_MAPPING] ?? [];
        console.log(`🏠 Room type "${roomType}" maps to categories:`, relevantCategories);

        // Fetch products for each category in parallel
        const categoryPromises = relevantCategories.map(async (category) => {
          const filters: FurnitureFilters = {
            category: category,
            limit: Math.ceil(limit / relevantCategories.length) + 4, // Get extra to ensure variety
          };

          if (min !== undefined) filters.min_price = min;
          if (max !== undefined) filters.max_price = max;

          try {
            const response = await furnitureApi.getProducts(filters);
            console.log(`📦 Category "${category}": ${response.data.length} products`);
            return response.data;
          } catch (err) {
            console.warn(`⚠️ Failed to fetch category "${category}":`, err);
            return [];
          }
        });

        const categoryResults = await Promise.all(categoryPromises);

        // Combine all category results
        categoryResults.forEach(products => {
          allProducts.push(...products);
        });

        // Remove duplicates by ID
        const uniqueProducts = new Map<string, FurnitureProduct>();
        allProducts.forEach(product => {
          if (!uniqueProducts.has(product.id)) {
            uniqueProducts.set(product.id, product);
          }
        });
        allProducts = Array.from(uniqueProducts.values());

        console.log(`🏠 Total unique products for "${roomType}": ${allProducts.length}`);
      }

      // If no room-specific results or no room type, fetch general products
      if (allProducts.length === 0) {
        console.log('📦 Fetching general products (no room type or no category matches)');
        const filters: FurnitureFilters = {
          limit: limit * 2,
          featured: true,
        };

        if (min !== undefined) filters.min_price = min;
        if (max !== undefined) filters.max_price = max;

        const response = await furnitureApi.getProducts(filters);
        allProducts = response.data;
      }

      // Shuffle the results for variety
      const shuffled = [...allProducts];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Limit to requested number
      const finalProducts = shuffled.slice(0, limit);

      console.log(`✅ Returning ${finalProducts.length} furniture suggestions for "${roomType || 'general'}"`);
      setProducts(finalProducts);
      lastRoomTypeRef.current = roomType;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch furniture suggestions';
      console.error('❌ Error fetching furniture suggestions:', err);
      setError(errorMessage);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProducts();
  };

  // Fetch products when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [budgetRange, roomType, limit]);

  return {
    products,
    loading,
    error,
    refetch,
  };
}