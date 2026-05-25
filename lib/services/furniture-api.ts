import type { FurnitureProduct, FurnitureApiResponse, FurnitureFilters } from '@/types/furniture';

/**
 * Furniture data is sourced from DummyJSON (https://dummyjson.com) — a free,
 * stable, key-less product API. The previous provider (furniture-api.fly.dev)
 * was unreachable and caused "fetch failed" 500s.
 *
 * Strategy:
 *  - Pull the home/furniture-relevant categories once and cache the normalized
 *    pool in-memory (5 min TTL), with in-flight de-duplication so concurrent
 *    callers share a single network request.
 *  - Never throw on network failure — return an empty list so the UI can show a
 *    graceful fallback instead of crashing.
 */
const DUMMYJSON_BASE = 'https://dummyjson.com';
// DummyJSON categories that map to interior-design furniture / decor.
const FURNITURE_CATEGORIES = ['furniture', 'home-decoration'];
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const REQUEST_TIMEOUT = 10000; // 10 seconds

interface DummyJsonProduct {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  sku?: string;
  dimensions?: { width: number; height: number; depth: number };
  thumbnail?: string;
  images?: string[];
}

interface DummyJsonCategoryResponse {
  products?: DummyJsonProduct[];
}

/** Normalize a DummyJSON product into the app's FurnitureProduct shape. */
function mapToFurnitureProduct(p: DummyJsonProduct): FurnitureProduct {
  const hasDiscount = typeof p.discountPercentage === 'number' && p.discountPercentage > 0;
  const discountPrice = hasDiscount
    ? Math.round(p.price * (1 - (p.discountPercentage as number) / 100))
    : undefined;

  return {
    id: String(p.id),
    sku: p.sku || String(p.id),
    name: p.title,
    category: p.category || 'furniture',
    wood_type: '',
    description: p.description || '',
    dimensions: p.dimensions ?? { width: 0, height: 0, depth: 0 },
    price: p.price,
    discount_price: discountPrice,
    image_path: p.thumbnail || p.images?.[0] || '',
    stock: p.stock ?? 0,
    featured: (p.rating ?? 0) >= 4.5,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    externalUrl: `${DUMMYJSON_BASE}/products/${p.id}`,
  };
}

class FurnitureApiService {
  private poolCache: { data: FurnitureProduct[]; timestamp: number } | null = null;
  private inflight: Promise<FurnitureProduct[]> | null = null;

  private async fetchJson<T>(url: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Fetch & cache the normalized furniture pool.
   * Never throws — returns [] if every category request fails.
   */
  private async getPool(): Promise<FurnitureProduct[]> {
    if (this.poolCache && Date.now() - this.poolCache.timestamp < CACHE_EXPIRY) {
      return this.poolCache.data;
    }

    // Share a single in-flight request across concurrent callers.
    if (this.inflight) {
      return this.inflight;
    }

    this.inflight = (async () => {
      const results = await Promise.all(
        FURNITURE_CATEGORIES.map(async (category) => {
          try {
            const json = await this.fetchJson<DummyJsonCategoryResponse>(
              `${DUMMYJSON_BASE}/products/category/${encodeURIComponent(category)}?limit=0`
            );
            return Array.isArray(json.products) ? json.products : [];
          } catch (error) {
            console.warn(`⚠️ Failed to fetch furniture category "${category}":`, error);
            return [] as DummyJsonProduct[];
          }
        })
      );

      const mapped = results.flat().map(mapToFurnitureProduct).filter((p) => p.image_path);
      // De-duplicate by id.
      const unique = Array.from(new Map(mapped.map((p) => [p.id, p])).values());

      // Only cache successful (non-empty) results so a transient outage doesn't
      // poison the cache for the full TTL.
      if (unique.length > 0) {
        this.poolCache = { data: unique, timestamp: Date.now() };
      }

      return unique;
    })();

    try {
      return await this.inflight;
    } finally {
      this.inflight = null;
    }
  }

  private applyFilters(pool: FurnitureProduct[], filters: FurnitureFilters): FurnitureProduct[] {
    const effectivePrice = (p: FurnitureProduct) => p.discount_price ?? p.price;
    let filtered = pool;

    if (filters.min_price !== undefined || filters.max_price !== undefined) {
      const priceFiltered = pool.filter((p) => {
        const price = effectivePrice(p);
        if (filters.min_price !== undefined && price < filters.min_price) return false;
        if (filters.max_price !== undefined && price > filters.max_price) return false;
        return true;
      });
      // Design budgets are room-level (often far above individual item prices),
      // so if the price filter empties the list, fall back to the full pool
      // rather than showing nothing.
      filtered = priceFiltered.length > 0 ? priceFiltered : pool;
    }

    if (filters.featured) {
      const featuredOnly = filtered.filter((p) => p.featured);
      filtered = featuredOnly.length > 0 ? featuredOnly : filtered;
    }

    return filtered;
  }

  async getProducts(filters: FurnitureFilters = {}): Promise<FurnitureApiResponse> {
    const pool = await this.getPool();
    const filtered = this.applyFilters(pool, filters);
    const limited =
      filters.limit && filters.limit > 0 ? filtered.slice(0, filters.limit) : filtered;

    return {
      data: limited,
      pagination: {
        page: filters.page ?? 1,
        per_page: limited.length,
        total: filtered.length,
        total_pages: 1,
      },
    };
  }

  async getProductBySku(sku: string): Promise<FurnitureProduct> {
    const pool = await this.getPool();
    const product = pool.find((p) => p.sku === sku || p.id === sku);
    if (!product) {
      throw new Error(`Product with SKU ${sku} not found`);
    }
    return product;
  }

  async getFeaturedProducts(limit = 4): Promise<FurnitureProduct[]> {
    const response = await this.getProducts({ featured: true, limit });
    return response.data;
  }

  async getProductsByCategory(category: string, limit = 10): Promise<FurnitureProduct[]> {
    const response = await this.getProducts({ category, limit });
    return response.data;
  }

  async getRandomProducts(limit = 4): Promise<FurnitureProduct[]> {
    const pool = await this.getPool();
    if (pool.length === 0) {
      return [];
    }

    // Fisher-Yates shuffle for variety.
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, limit);
  }

  async getProductsForRoom(roomType: string, limit = 4): Promise<FurnitureProduct[]> {
    // DummyJSON doesn't expose room-specific subcategories, so we surface a
    // varied selection from the furniture pool.
    console.log(`🏠 Getting furniture suggestions for room type: ${roomType || 'any'}`);
    return this.getRandomProducts(limit);
  }

  clearCache(): void {
    this.poolCache = null;
  }

  clearCategoryCache(_category?: string): void {
    // The pool is shared across categories, so clearing it wholesale is sufficient.
    this.poolCache = null;
  }
}

export const furnitureApi = new FurnitureApiService();
