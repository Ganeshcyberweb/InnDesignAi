import type { FurnitureProduct, FurnitureApiResponse, FurnitureApiError, FurnitureFilters } from '@/types/furniture';

const BASE_URL = 'https://furniture-api.fly.dev/v1';
const CACHE_KEY = 'furniture-api-cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: FurnitureApiResponse;
  timestamp: number;
}

class FurnitureApiService {
  private cache = new Map<string, CacheEntry>();

  private getCacheKey(filters: FurnitureFilters = {}): string {
    return JSON.stringify(filters);
  }

  private isValidCache(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < CACHE_EXPIRY;
  }

  private async fetchWithErrorHandling(url: string): Promise<FurnitureApiResponse> {
    console.log(`🔄 Fetching furniture API: ${url}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      console.log(`📡 API Response: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`❌ API Error Response: ${errorText}`);
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseText = await response.text();

      if (!responseText) {
        console.error('❌ Empty response from API');
        throw new Error('Empty response from API');
      }

      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse JSON response:', parseError);
        console.error('Raw response:', responseText.substring(0, 200));
        throw new Error('Invalid JSON response from API');
      }

      // Handle different API response formats
      let data: FurnitureProduct[];
      if (parsedData.success && parsedData.data) {
        // API returns { success: true, count: number, data: FurnitureProduct[] }
        data = parsedData.data;
        console.log(`✅ Successfully fetched ${data.length} items from API`);
      } else if (Array.isArray(parsedData)) {
        // API returns FurnitureProduct[] directly
        data = parsedData;
        console.log(`✅ Successfully fetched ${data.length} items from API (direct array)`);
      } else {
        console.error('❌ Unexpected API response format:', parsedData);
        throw new Error('Unexpected API response format');
      }

      if (!Array.isArray(data)) {
        console.error('❌ Expected array of products, got:', typeof data);
        throw new Error('API response data is not an array');
      }

      return {
        data,
        pagination: {
          page: 1,
          per_page: data.length,
          total: parsedData.count || data.length,
          total_pages: 1
        }
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('❌ Request timed out after 10 seconds');
        throw new Error('Request timed out. Please check your internet connection.');
      }

      console.error('❌ Furniture API Error:', error);

      // Provide more user-friendly error messages
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to furniture API. Please check your internet connection.');
      }

      throw error;
    }
  }

  async getProducts(filters: FurnitureFilters = {}): Promise<FurnitureApiResponse> {
    const cacheKey = this.getCacheKey(filters);
    const cachedEntry = this.cache.get(cacheKey);

    if (cachedEntry && this.isValidCache(cachedEntry)) {
      return cachedEntry.data;
    }

    const params = new URLSearchParams();

    if (filters.category) params.append('category', filters.category);
    if (filters.wood_type) params.append('wood_type', filters.wood_type);
    if (filters.min_price) params.append('min_price', filters.min_price.toString());
    if (filters.max_price) params.append('max_price', filters.max_price.toString());
    if (filters.featured) params.append('featured', filters.featured.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.page) params.append('page', filters.page.toString());

    const url = `${BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await this.fetchWithErrorHandling(url);

    // Cache the response
    this.cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return response;
  }

  async getProductBySku(sku: string): Promise<FurnitureProduct> {
    const url = `${BASE_URL}/products/${sku}`;
    const response = await this.fetchWithErrorHandling(url);

    if (!response.data[0]) {
      throw new Error(`Product with SKU ${sku} not found`);
    }

    return response.data[0];
  }

  async getFeaturedProducts(limit: number = 4): Promise<FurnitureProduct[]> {
    const response = await this.getProducts({ featured: true, limit });
    return response.data;
  }

  async getProductsByCategory(category: string, limit: number = 10): Promise<FurnitureProduct[]> {
    const response = await this.getProducts({ category, limit });
    return response.data;
  }

  async getRandomProducts(limit: number = 4): Promise<FurnitureProduct[]> {
    // Get a larger pool to ensure randomness and avoid duplicates
    const poolSize = Math.max(50, limit * 3);
    const response = await this.getProducts({ limit: poolSize });
    const products = response.data;

    if (products.length === 0) {
      return [];
    }

    // Better shuffle algorithm (Fisher-Yates)
    const shuffled = [...products];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, limit);
  }

  // Get products suitable for a specific room type
  async getProductsForRoom(roomType: string, limit: number = 4): Promise<FurnitureProduct[]> {
    // For now, we'll get random products since the API categories don't perfectly match room types
    // This can be enhanced when more category data is available
    console.log(`🏠 Getting products for room type: ${roomType} (using random products for now)`);
    return this.getRandomProducts(limit);
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const furnitureApi = new FurnitureApiService();