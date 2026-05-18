/**
 * Shopify Files CDN — all site images hosted on Shopify's global CDN.
 *
 * Base: https://cdn.shopify.com/s/files/1/0990/0464/5681/files/
 *
 * Upload images via: Shopify Admin → Content → Files → Upload files
 * All images from the /shopify-upload/ folder belong here.
 */

const CDN_BASE = "https://cdn.shopify.com/s/files/1/0990/0464/5681/files/";

/** Build a full CDN URL from a bare filename, e.g. "hero_img-1.webp" */
export function cdnFile(filename: string): string {
  return `${CDN_BASE}${filename}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Product images (catalog cards + PDP hero views + rugs)
// ─────────────────────────────────────────────────────────────────────────────
export const CDN_PRODUCTS = {
  "listing-eira-chair": cdnFile("listing-eira-chair.webp"),
  "listing-dunari-chair": cdnFile("listing-dunari-chair.webp"),
  "listing-dunari-ottoman": cdnFile("listing-dunari-ottoman.webp"),
  "listing-dunari-table": cdnFile("listing-dunari-table.webp"),
  "listing-eira-table": cdnFile("listing-eira-table.webp"),
  "dunari-rug": cdnFile("dunari-rug.webp"),
  "eira-rug-navy": cdnFile("eira-rug-navy.webp"),
  "eira-rug-earth": cdnFile("eira-rug-earth.webp"),
  "eira-chair-view1": cdnFile("eira-chair-view1.webp"),
  "eira-chair-view2": cdnFile("eira-chair-view2.webp"),
  "dunari-ottoman-view1": cdnFile("dunari-ottoman-view1.webp"),
  "dunari-ottoman-view2": cdnFile("dunari-ottoman-view2.webp"),
  "rug-hero-lifestyle": cdnFile("rug-hero-lifestyle.webp"),
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Product detail gallery images
// ─────────────────────────────────────────────────────────────────────────────
export const CDN_GALLERY = {
  "dunari-gallery-1": cdnFile("dunari-gallery-1.webp"),
  "dunari-gallery-2": cdnFile("dunari-gallery-2.webp"),
  "dunari-gallery-3": cdnFile("dunari-gallery-3.webp"),
  "dunari-gallery-4": cdnFile("dunari-gallery-4.webp"),
  "lifestyle-1": cdnFile("lifestyle-1.webp"),
  "lifestyle-2": cdnFile("lifestyle-2.webp"),
  "lifestyle-3": cdnFile("lifestyle-3.webp"),
  "lifestyle-4": cdnFile("lifestyle-4.webp"),
  "fabric-swatches": cdnFile("fabric-swatches.webp"),
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Page hero banners
// ─────────────────────────────────────────────────────────────────────────────
export const CDN_HEROES = {
  "hero-slide-1": cdnFile("hero_img-1.webp"),
  "hero-slide-2": cdnFile("hero_img-2.webp"),
  "hero-slide-3": cdnFile("hero_img-3.webp"),
  "furniture-hero": cdnFile("furniture-hero.webp"),
  "collection-dunari-hero": cdnFile("collection-dunari-hero.webp"),
  "discover-hero": cdnFile("discover_hero.webp"),
  "discover-hero-bg": cdnFile("hero-bg.webp"),
  "customizations-hero": cdnFile("customizations-hero-bg.webp"),
  "eira-collection-hero": cdnFile("hero-lifestyle.webp"),
  "dunari-collection-hero": cdnFile("hero-lifestyle-dunari.webp"),
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Lifestyle / editorial imagery
// ─────────────────────────────────────────────────────────────────────────────
export const CDN_LIFESTYLE = {
  "discover-product-1": cdnFile("product-1.webp"),
  "discover-product-2": cdnFile("product-2.webp"),
  "discover-product-3": cdnFile("product-3.webp"),
  "discover-product-4": cdnFile("product-4.webp"),
  "discover-product-5": cdnFile("product-5.png"),
  "discover-chair-1": cdnFile("chair-1.webp"),
  "discover-chair-2": cdnFile("chair-2.webp"),
  "discover-chair-3": cdnFile("chair-3.webp"),
  "discover-chair-4": cdnFile("chair-4.webp"),
  "discover-chair-5": cdnFile("chair-5.webp"),
  "spotlight-chair": cdnFile("spotlight-chair.webp"),
  "explore-furniture": cdnFile("furniture.webp"),
  "explore-rugs": cdnFile("rugs.webp"),
  "mega-menu-feature": cdnFile("mega-menu-feature.webp"),
  "customisation-cta": cdnFile("customisation-cta.webp"),
  "how-it-works-photo": cdnFile("how-it-works-photo.webp"),
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Legacy helpers — used by Shopify product mapper
// ─────────────────────────────────────────────────────────────────────────────

/** Product handle → primary listing image CDN URL */
const PRIMARY_IMAGE_BY_HANDLE: Record<string, string> = {
  "eira-chair": CDN_PRODUCTS["listing-eira-chair"],
  "eira-table": CDN_PRODUCTS["listing-eira-table"],
  "dunari-chair": CDN_PRODUCTS["listing-dunari-chair"],
  "dunari-table": CDN_PRODUCTS["listing-dunari-table"],
  "dunari-ottoman": CDN_PRODUCTS["listing-dunari-ottoman"],
  "dunari-rug": CDN_PRODUCTS["dunari-rug"],
  "eira-rug": CDN_PRODUCTS["eira-rug-navy"],
  "biophilic-rug": CDN_PRODUCTS["rug-hero-lifestyle"],
};

export function resolveProductImage(
  handle: string,
  shopifyUrl?: string | null,
): string {
  if (shopifyUrl) return shopifyUrl;
  return PRIMARY_IMAGE_BY_HANDLE[handle] ?? "";
}

export function resolveGalleryImages(
  handle: string,
  shopifyUrls: string[],
): string[] {
  const urls = shopifyUrls.filter(Boolean);
  if (urls.length > 0) return urls;

  const primary = resolveProductImage(handle, null);
  if (!primary) return [];

  const extras: string[] = [];
  if (handle === "eira-chair") extras.push(CDN_PRODUCTS["eira-chair-view2"]);
  if (handle === "dunari-ottoman")
    extras.push(CDN_PRODUCTS["dunari-ottoman-view2"]);
  return [primary, ...extras];
}
