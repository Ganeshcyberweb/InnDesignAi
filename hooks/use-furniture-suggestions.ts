import { useState, useEffect } from 'react';
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Parse budget range
      const { min, max } = parseBudgetRange(budgetRange || '');

      // Build filters
      const filters: FurnitureFilters = {
        limit: limit * 2, // Get more products to allow for filtering
        featured: true, // Prefer featured products for suggestions
      };

      if (min !== undefined) {
        filters.min_price = min;
      }

      if (max !== undefined) {
        filters.max_price = max;
      }

      console.log('🔍 Fetching furniture suggestions with filters:', filters);

      // Fetch products from API
      const response = await furnitureApi.getProducts(filters);
      let fetchedProducts = response.data;

      console.log(`📦 Fetched ${fetchedProducts.length} products from API`);

      // If we have a room type, try to get relevant categories
      if (roomType && roomType in ROOM_FURNITURE_MAPPING) {
        const relevantCategories = ROOM_FURNITURE_MAPPING[roomType as keyof typeof ROOM_FURNITURE_MAPPING];

        // Filter products by relevant categories (case-insensitive)
        const categoryFiltered = fetchedProducts.filter(product =>
          relevantCategories?.some(category =>
            product.category.toLowerCase().includes(category.toLowerCase()) ||
            category.toLowerCase().includes(product.category.toLowerCase())
          )
        );

        if (categoryFiltered.length > 0) {
          fetchedProducts = categoryFiltered;
          console.log(`🏠 Filtered to ${fetchedProducts.length} products for room type: ${roomType}`);
        } else {
          console.log(`⚠️ No category matches found for room type ${roomType}, using all products`);
        }
      }

      // If we don't have enough products, get random products as fallback
      if (fetchedProducts.length < limit / 2) {
        console.log('📦 Not enough filtered products, getting random products as fallback');
        const randomProducts = await furnitureApi.getRandomProducts(limit);

        // Merge with existing products, avoiding duplicates
        const existingIds = new Set(fetchedProducts.map(p => p.id));
        const additionalProducts = randomProducts.filter(p => !existingIds.has(p.id));

        fetchedProducts = [...fetchedProducts, ...additionalProducts];
      }

      // Shuffle the results for variety
      const shuffled = [...fetchedProducts];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Limit to requested number
      const finalProducts = shuffled.slice(0, limit);

      console.log(`✅ Returning ${finalProducts.length} furniture suggestions`);
      setProducts(finalProducts);
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