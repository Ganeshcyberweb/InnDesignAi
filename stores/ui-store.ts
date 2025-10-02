import { create } from 'zustand';

interface UIState {
  activeTab: string;
  selectedPalette: string;
  setActiveTab: (tab: string) => void;
  setSelectedPalette: (palette: string) => void;
  resetUIState: () => void;
}

const initialUIState = {
  activeTab: 'styleA',
  selectedPalette: 'neutral',
};

export const useUIStore = create<UIState>((set) => ({
  ...initialUIState,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedPalette: (palette) => set({ selectedPalette: palette }),
  resetUIState: () => set(initialUIState),
}));