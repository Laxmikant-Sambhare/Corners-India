import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CatalogProduct } from "../catalog/catalogPageTypes";

export type WishlistItem = {
  id: string;
  product: CatalogProduct;
};

type WishlistStore = {
  items: WishlistItem[];
  toggleWishlist: (product: CatalogProduct) => void;
  removeFromWishlist: (id: string) => void;
  clearWishlist: () => void;
};

export function wishlistItemId(product: Pick<CatalogProduct, "name">): string {
  return product.name;
}

export function isProductInWishlist(
  items: WishlistItem[],
  product: Pick<CatalogProduct, "name">,
): boolean {
  const id = wishlistItemId(product);
  return items.some((item) => item.id === id);
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist(product) {
        const id = wishlistItemId(product);
        const exists = get().items.some((item) => item.id === id);
        set({
          items: exists
            ? get().items.filter((item) => item.id !== id)
            : [...get().items, { id, product }],
        });
      },

      removeFromWishlist(id) {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      clearWishlist() {
        set({ items: [] });
      },
    }),
    { name: "corners-wishlist" },
  ),
);

export function wishlistTotalItems(items: WishlistItem[]): number {
  return items.length;
}
