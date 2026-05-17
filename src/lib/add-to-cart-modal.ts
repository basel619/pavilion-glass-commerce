import { create } from "zustand";

interface AddToCartModalStore {
  isOpen: boolean;
  productName: string;
  open: (name: string) => void;
  close: () => void;
}

export const useAddToCartModal = create<AddToCartModalStore>((set) => ({
  isOpen: false,
  productName: "",
  open: (name) => set({ isOpen: true, productName: name }),
  close: () => set({ isOpen: false }),
}));
