import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/pricing";
import { calculateTotals } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  isOrderFormOpen: boolean;
  // Принимает уже готовую цену (с учётом наценки/скидки), а не только id —
  // цена товара живёт на сервере (админка может её менять/уценять), поэтому
  // клиентский стор больше не подставляет её сам из статического каталога.
  addItem: (item: { id: string; title: string; price: number }) => void;
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

      addItem: (item) =>
        set((state) => {
          trackEvent("add_to_cart", { productId: item.id });
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i)),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { id: item.id, title: item.title, price: item.price, qty: 1 }],
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
