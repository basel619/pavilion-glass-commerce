import { create } from "zustand";

interface BuyNowStore {
  product: any | null;
  isOpen: boolean;
  open: (product: any) => void;
  close: () => void;
}

export const useBuyNow = create<BuyNowStore>((set) => ({
  product: null,
  isOpen: false,
  open: (product) => set({ product, isOpen: true }),
  close: () => set({ product: null, isOpen: false }),
}));
