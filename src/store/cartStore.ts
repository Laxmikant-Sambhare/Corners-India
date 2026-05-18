import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CatalogProduct } from "../catalog/catalogPageTypes";

export type CartItem = {
  /** Stable key: product name + chosen size. */
  id: string;
  product: CatalogProduct;
  size: string;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: CatalogProduct, size: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
};

function makeId(productName: string, size: string) {
  return `${productName}__${size}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addToCart(product, size, quantity) {
        const id = makeId(product.name, size);
        set((state) => {
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...state.items, { id, product, size, quantity }] };
        });
      },

      removeFromCart(id) {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
      },

      updateQuantity(id, delta) {
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
            .filter((i) => i.quantity > 0),
        }));
      },

      clearCart() {
        set({ items: [] });
      },
    }),
    { name: "corners-cart" },
  ),
);

/** Total number of individual units across all line items. */
export function cartTotalItems(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
