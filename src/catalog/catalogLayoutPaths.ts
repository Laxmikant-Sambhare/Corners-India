/**
 * Routes that use the full-bleed catalog hero in `AppLayout` and the tan `SiteFooter` shell.
 */
export const CATALOG_LAYOUT_PATHS = [
  "/category/furniture",
  "/category/rugs",
  "/collections/dunari",
  "/collections/eira",
] as const;

export type CatalogLayoutPath = (typeof CATALOG_LAYOUT_PATHS)[number];

export function isCatalogLayoutPathname(pathname: string): boolean {
  return (CATALOG_LAYOUT_PATHS as readonly string[]).includes(pathname);
}

/** `/product/$slug` routes use the same full-bleed hero treatment. */
export function isPdpPathname(pathname: string): boolean {
  return pathname.startsWith("/product/");
}

/** Routes with a full-bleed hero that need the navbar overlaid (non-catalog). */
export function isFullBleedHeroPathname(pathname: string): boolean {
  return pathname === "/customizations" || pathname === "/discover";
}
