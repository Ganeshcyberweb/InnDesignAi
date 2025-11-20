import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { FurnitureProduct } from '@/types/furniture';

// Interface for serialized images (stored as base64)
export interface SerializedImage {
  name: string;
  base64: string;
  type: string;
  size: number;
}

// Pending design data structure (matches DesignFormData + images)
export interface PendingDesignData {
  prompt: string;
  roomType: string;
  roomSize: string;
  stylePreference: string;
  budgetRange: string;
  colorPalette: string;
  customColors: string[];
  selectedFurnitureItems: FurnitureProduct[];
  images: SerializedImage[]; // Uploaded images as base64
}

interface PendingDesignState {
  pendingDesign: PendingDesignData | null;
  hasPendingDesign: boolean;

  // Actions
  savePendingDesign: (data: PendingDesignData) => void;
  loadAndClear: () => PendingDesignData | null;
  clear: () => void;
}

const emptyPendingDesign: PendingDesignData = {
  prompt: "",
  roomType: "living_room",
  roomSize: "",
  stylePreference: "modern",
  budgetRange: "$1,000 - $5,000",
  colorPalette: "neutral",
  customColors: ["#000000", "#808080", "#ffffff"],
  selectedFurnitureItems: [],
  images: [],
};

export const usePendingDesignStore = create<PendingDesignState>()(
  persist(
    (set, get) => ({
      pendingDesign: null,
      hasPendingDesign: false,

      savePendingDesign: (data) => {
        console.log('💾 Saving pending design to storage:', {
          prompt: data.prompt.substring(0, 50) + '...',
          imagesCount: data.images.length,
          furnitureCount: data.selectedFurnitureItems.length,
        });

        set({
          pendingDesign: data,
          hasPendingDesign: true,
        });
      },

      loadAndClear: () => {
        const { pendingDesign, hasPendingDesign } = get();

        if (!hasPendingDesign || !pendingDesign) {
          console.log('📭 No pending design found');
          return null;
        }

        console.log('📬 Loading pending design:', {
          prompt: pendingDesign.prompt.substring(0, 50) + '...',
          imagesCount: pendingDesign.images.length,
          furnitureCount: pendingDesign.selectedFurnitureItems.length,
        });

        // Clear after loading
        set({
          pendingDesign: null,
          hasPendingDesign: false,
        });

        return pendingDesign;
      },

      clear: () => {
        console.log('🧹 Clearing pending design');
        set({
          pendingDesign: null,
          hasPendingDesign: false,
        });
      },
    }),
    {
      name: 'inndesign-pending-design', // Storage key
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage (clears on tab close)
    }
  )
);
