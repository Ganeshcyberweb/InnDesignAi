export interface FurnitureProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  wood_type: string;
  description: string;
  finish?: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  price: number;
  discount_price?: number;
  weight?: number;
  image_path: string;
  stock: number;
  featured: boolean;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface FurnitureApiResponse {
  data: FurnitureProduct[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface FurnitureApiError {
  error: string;
  message: string;
  status: number;
}

export interface FurnitureFilters {
  category?: string;
  wood_type?: string;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  limit?: number;
  page?: number;
}

export interface RoomCategoryMapping {
  living_room: string[];
  bedroom: string[];
  kitchen: string[];
  bathroom: string[];
  dining_room: string[];
  office: string[];
  outdoor?: string[];
}

export const ROOM_FURNITURE_MAPPING: RoomCategoryMapping = {
  living_room: ['Lamps', 'Tables', 'Chairs', 'Sofas'],
  bedroom: ['Lamps', 'Tables', 'Storage'],
  kitchen: ['Tables', 'Chairs', 'Storage'],
  bathroom: ['Storage', 'Lamps'],
  dining_room: ['Tables', 'Chairs', 'Lamps'],
  office: ['Tables', 'Chairs', 'Lamps', 'Storage'],
  outdoor: ['Garden', 'Outdoor']
};