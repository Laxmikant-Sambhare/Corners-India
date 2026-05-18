import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { resolveGalleryImages, resolveProductImage } from "./cdnImages";
import type { ShopifyProduct } from "./types";

/** Format a Shopify money amount string as INR display value. */
function formatINR(amount: string): string {
  const n = parseFloat(amount);
  return `Rs. ${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Convert a Shopify product into the `CatalogProduct` shape the UI expects. */
export function shopifyToCatalogProduct(p: ShopifyProduct): CatalogProduct {
  const isRug = p.productType.toLowerCase() === "rug";

  // Collect unique Size option values and track which sizes have stock
  const seen = new Set<string>();
  const sizes: string[] = [];
  const availableSizeSet = new Set<string>();
  for (const v of p.variants.nodes) {
    const sizeOpt = v.selectedOptions.find((o) => o.name === "Size");
    if (sizeOpt) {
      if (!seen.has(sizeOpt.value)) {
        seen.add(sizeOpt.value);
        sizes.push(sizeOpt.value);
      }
      if (v.availableForSale) {
        availableSizeSet.add(sizeOpt.value);
      }
    }
  }
  const availableSizes = sizes.length > 0 ? sizes.filter((s) => availableSizeSet.has(s)) : undefined;

  const shopifyGallery = p.images.nodes.map((img) => img.url);
  const gallery = resolveGalleryImages(p.handle, shopifyGallery);
  const image =
    resolveProductImage(p.handle, p.featuredImage?.url ?? shopifyGallery[0]) ||
    gallery[0] ||
    "";

  const availableForSale = p.variants.nodes.some((v) => v.availableForSale);

  return {
    badge: p.productType || p.tags[0] || "New",
    name: p.title,
    price: formatINR(p.priceRange.minVariantPrice.amount),
    image,
    availableForSale,
    detail: {
      gallery: gallery.length > 0 ? gallery : image ? [image] : [],
      storyTitle: `Story of ${p.title}`,
      storyBody: p.description,
      sizes: isRug && sizes.length > 0 ? sizes : [],
      availableSizes,
      mrpNote: "MRP incl. of all taxes",
    },
  };
}

export function isRugProduct(p: ShopifyProduct): boolean {
  return p.productType.toLowerCase() === "rug";
}

/** Build a name → CatalogProduct lookup map from a list of Shopify products. */
export function buildProductNameMap(
  products: ShopifyProduct[],
): Map<string, CatalogProduct> {
  const map = new Map<string, CatalogProduct>();
  for (const p of products) {
    map.set(p.title.toLowerCase(), shopifyToCatalogProduct(p));
  }
  return map;
}

/** Build a handle → CatalogProduct lookup map from a list of Shopify products. */
export function buildProductHandleMap(
  products: ShopifyProduct[],
): Map<string, CatalogProduct> {
  const map = new Map<string, CatalogProduct>();
  for (const p of products) {
    map.set(p.handle, shopifyToCatalogProduct(p));
  }
  return map;
}
