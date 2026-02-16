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

// Valid API categories: sofa, chair, stool, table, desk, kitchen, vanitory, matress, mirror, wardrove, lamp, tv table, garden
export const ROOM_FURNITURE_MAPPING: RoomCategoryMapping = {
  living_room: ['sofa', 'chair', 'table', 'lamp', 'tv table'],
  bedroom: ['matress', 'wardrove', 'lamp', 'mirror', 'table'],
  kitchen: ['kitchen', 'table', 'chair', 'stool'],
  bathroom: ['vanitory', 'mirror', 'lamp'],
  dining_room: ['table', 'chair', 'lamp'],
  office: ['desk', 'chair', 'lamp', 'table'],
  outdoor: ['garden']
};