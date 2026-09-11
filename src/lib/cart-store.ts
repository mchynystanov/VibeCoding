import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/pricing";
import { calculateTotals } from "@/lib/pricing";
import { getProductById } from "@/data/products";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  isOrderFormOpen: boolean;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  openOrderForm: () => void;
  closeOrderForm: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      isOrderFormOpen: false,

      addItem: (productId) =>
        set((state) => {
          const existing = state.items.find((item) => item.id === productId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === productId ? { ...item, qty: item.qty + 1 } : item,
              ),
              isOpen: true,
            };
          }
          const product = getProductById(productId);
          if (!product) return state;
          return {
            items: [
              ...state.items,
              { id: product.id, title: product.title, price: product.price, qty: 1 },
            ],
            isOpen: true,
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),

      setQty: (productId, qty) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, qty: Math.max(1, qty) } : item,
          ),
        })),

      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      openOrderForm: () => set({ isOpen: false, isOrderFormOpen: true }),
      closeOrderForm: () => set({ isOrderFormOpen: false }),
    }),
    {
      name: "paomma-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function useCartTotals() {
  return useCartStore((state) => calculateTotals(state.items));
}

export function useCartCount() {
  return useCartStore((state) => state.items.reduce((sum, item) => sum + item.qty, 0));
}
