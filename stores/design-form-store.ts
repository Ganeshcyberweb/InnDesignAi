import { create } from 'zustand';
import type { FurnitureProduct } from '@/types/furniture';

interface DesignFormData {
  prompt: string;
  roomType: string;
  roomSize: string;
  stylePreference: string;
  budgetRange: string;
  colorPalette: string;
  selectedFurnitureItems: FurnitureProduct[];
}

interface DesignFormState {
  formData: DesignFormData;
  updateField: (field: keyof DesignFormData, value: string) => void;
  updateFormData: (data: Partial<DesignFormData>) => void;
  resetForm: () => void;

  // Furniture selection actions
  addFurnitureItem: (item: FurnitureProduct) => void;
  removeFurnitureItem: (itemId: string) => void;
  clearFurnitureItems: () => void;
  updateFurnitureItems: (items: FurnitureProduct[]) => void;
  isFurnitureItemSelected: (itemId: string) => boolean;

  // Computed properties
  getTotalFurnitureCost: () => number;
  getFurnitureByCategory: () => Record<string, FurnitureProduct[]>;
  getSelectedItemsCount: () => number;
}

const initialFormData: DesignFormData = {
  prompt: "",
  roomType: "living_room",
  roomSize: "",
  stylePreference: "modern",
  budgetRange: "$1,000 - $5,000",
  colorPalette: "neutral",
  selectedFurnitureItems: [],
};

export const useDesignFormStore = create<DesignFormState>()((set, get) => ({
  formData: initialFormData,
  updateField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    })),
  updateFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () =>
    set({
      formData: initialFormData,
    }),

  // Furniture selection actions
  addFurnitureItem: (item) => {
    console.log('🛒 Adding furniture item to design form:', item.name);
    set((state) => {
      const exists = state.formData.selectedFurnitureItems.find(
        selected => selected.id === item.id
      );

      if (exists) {
        console.log('⚠️ Item already selected:', item.name);
        return state; // Don't add duplicates
      }

      // IMPORTANT: Gemini max is 3 images total
      // We need to leave room for 1 uploaded image, so max 2 furniture
      // But if user hasn't uploaded, they can select up to 3 furniture
      // Since we can't check upload count here, we enforce max 3 furniture
      // and the API will intelligently limit based on upload presence
      if (state.formData.selectedFurnitureItems.length >= 3) {
        console.log('⚠️ Maximum 3 furniture items already selected');
        return state;
      }

      const newSelectedItems = [...state.formData.selectedFurnitureItems, item];
      console.log('✅ Total selected items:', newSelectedItems.length);

      return {
        formData: {
          ...state.formData,
          selectedFurnitureItems: newSelectedItems,
        },
      };
    });
  },

  removeFurnitureItem: (itemId) => {
    console.log('🗑️ Removing furniture item:', itemId);
    set((state) => {
      const newSelectedItems = state.formData.selectedFurnitureItems.filter(
        item => item.id !== itemId
      );
      console.log('✅ Total selected items after removal:', newSelectedItems.length);

      return {
        formData: {
          ...state.formData,
          selectedFurnitureItems: newSelectedItems,
        },
      };
    });
  },

  clearFurnitureItems: () => {
    console.log('🧹 Clearing all selected furniture items');
    set((state) => ({
      formData: {
        ...state.formData,
        selectedFurnitureItems: [],
      },
    }));
  },

  updateFurnitureItems: (items) => {
    console.log('🔄 Updating furniture items list:', items.length);
    set((state) => ({
      formData: {
        ...state.formData,
        selectedFurnitureItems: items,
      },
    }));
  },

  isFurnitureItemSelected: (itemId) => {
    const { formData } = get();
    return formData?.selectedFurnitureItems?.some(item => item.id === itemId) || false;
  },

  // Computed properties
  getTotalFurnitureCost: () => {
    const { formData } = get();
    return formData?.selectedFurnitureItems?.reduce((total, item) => {
      const price = item.discount_price || item.price;
      return total + price;
    }, 0) || 0;
  },

  getFurnitureByCategory: () => {
    const { formData } = get();
    return formData?.selectedFurnitureItems?.reduce((categories, item) => {
      const category = item.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
      return categories;
    }, {} as Record<string, FurnitureProduct[]>) || {};
  },

  getSelectedItemsCount: () => {
    const { formData } = get();
    return formData?.selectedFurnitureItems?.length || 0;
  },
}));