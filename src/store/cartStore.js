import { create } from "zustand";

const useCartStore = create((set) => ({
  quantity: 0,
  setQuantity: (qty) => set({ quantity: qty }),
  increment: () => set((state) => ({ quantity: state.quantity + 1 })),
  resetQuantity: () => set({ quantity: 0 }),
}));

export default useCartStore;
