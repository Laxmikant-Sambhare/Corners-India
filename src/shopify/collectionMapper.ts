import type { CatalogHeroConfig } from "../catalog/catalogPageTypes";
import {
  COLLECTION_METAFIELD_KEYS,
  indexMetafields,
  metafieldImageUrl,
  metafieldString,
} from "./metafields";
import type { ShopifyCollection } from "./types";

/** Route pathname → Shopify collection handle. */
export const ROUTE_COLLECTION_HANDLE: Record<string, string> = {
  "/category/furniture": "furniture",
  "/category/rugs": "rugs",
  "/collections/dunari": "dunari",
  "/collections/eira": "eira",
};

export function collectionHandleForPath(pathname: string): string | undefined {
  return ROUTE_COLLECTION_HANDLE[pathname];
}

export function shopifyCollectionToHeroConfig(
  collection: ShopifyCollection | null | undefined,
  fallback: Pick<
    CatalogHeroConfig,
    | "sectionAriaLabel"
    | "title"
    | "breadcrumbCurrent"
    | "description"
    | "heroImageSrc"
    | "heroImageObjectPosition"
  >,
): CatalogHeroConfig {
  if (!collection) return { ...fallback };

  const mf = indexMetafields(collection.metafields);
  const heroImage = metafieldImageUrl(mf, COLLECTION_METAFIELD_KEYS.heroImage);
  const description =
    metafieldString(mf, COLLECTION_METAFIELD_KEYS.heroDescription) ||
    fallback.description;
  const objectPosition =
    metafieldString(mf, COLLECTION_METAFIELD_KEYS.heroObjectPosition) ||
    fallback.heroImageObjectPosition;

  return {
    sectionAriaLabel: fallback.sectionAriaLabel,
    title: collection.title || fallback.title,
    breadcrumbCurrent: collection.title || fallback.breadcrumbCurrent,
    description,
    heroImageSrc: heroImage || fallback.heroImageSrc,
    heroImageObjectPosition: objectPosition,
  };
}

export type CatalogCollectionsMap = Map<string, ShopifyCollection>;

export function buildCollectionsMap(
  data: {
    furniture: ShopifyCollection | null;
    rugs: ShopifyCollection | null;
    dunari: ShopifyCollection | null;
    eira: ShopifyCollection | null;
  } | null,
): CatalogCollectionsMap {
  const map = new Map<string, ShopifyCollection>();
  if (!data) return map;
  if (data.furniture) map.set("furniture", data.furniture);
  if (data.rugs) map.set("rugs", data.rugs);
  if (data.dunari) map.set("dunari", data.dunari);
  if (data.eira) map.set("eira", data.eira);
  return map;
}
