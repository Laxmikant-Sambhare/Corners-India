import type { CatalogProduct, CatalogProductDetail } from "../catalog/catalogPageTypes";

const DEFAULT_SIZES = [
  "5 ft x 6 ft",
  "6 ft x 7 ft",
  "7 ft x 8 ft",
  "8 ft x 9 ft",
] as const;

export function resolveProductDetail(product: CatalogProduct): CatalogProductDetail {
  if (product.detail) {
    return product.detail;
  }
  const img = product.image;
  return {
    gallery: [img, img, img, img],
    storyTitle: `Story of ${product.name}`,
    storyBody: `${product.name} is part of the Corners assortment—selected for material honesty and lasting comfort. Ask us about finishes and lead times.`,
    sizes: [...DEFAULT_SIZES],
    mrpNote: "MRP incl. of all taxes",
  };
}

/**
 * Parses price strings like "Rs. 50,000.00" or "RS 24,500" into a clean
 * "RS 50,000" display string, and returns the numeric value for calculations.
 */
export function parsePriceValue(price: string): number {
  // Strip the currency prefix (handles "Rs.", "RS", "rs." etc.) then commas
  const numStr = price.replace(/^\s*[Rr][Ss]\.?\s*/i, "").replace(/,/g, "");
  const n = Number.parseFloat(numStr);
  return Number.isFinite(n) ? n : 0;
}

export function formatPriceShort(price: string): string {
  const n = parsePriceValue(price);
  if (n === 0) return price;
  return `RS ${Math.round(n).toLocaleString("en-IN")}`;
}
