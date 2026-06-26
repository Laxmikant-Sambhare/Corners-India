import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import {
  fetchAllProducts,
  fetchCatalogCollections,
  isShopifyConfigured,
} from "./client";
import {
  buildCollectionsMap,
  collectionHandleForPath,
} from "./collectionMapper";
import {
  buildProductHandleMap,
  buildProductNameMap,
  isRugProduct,
  shopifyToCatalogProduct,
} from "./mappers";
import {
  shopifyToPdpBodyConfig,
  shopifyToProductHeroConfig,
} from "./pdpMapper";
import type { ShopifyProduct } from "./types";

const STALE_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch all Shopify products. Only fires when both env vars are set.
 */
export function useShopifyProducts() {
  return useQuery({
    queryKey: ["shopify", "products"],
    queryFn: fetchAllProducts,
    staleTime: STALE_MS,
    enabled: isShopifyConfigured,
    retry: 2,
  });
}

export function useShopifyCollections() {
  return useQuery({
    queryKey: ["shopify", "collections"],
    queryFn: fetchCatalogCollections,
    staleTime: STALE_MS,
    enabled: isShopifyConfigured,
    retry: 2,
  });
}

export function useShopifyCollectionsMap() {
  const { data } = useShopifyCollections();
  return useMemo(() => buildCollectionsMap(data ?? null), [data]);
}

export function useShopifyProductByHandle(handle: string | undefined) {
  const { data, isLoading, isFetched, isError } = useShopifyProducts();

  const product = useMemo(() => {
    if (!handle || !data) return undefined;
    return data.find((p) => p.handle === handle);
  }, [data, handle]);

  const heroConfig = useMemo(
    () => (product ? shopifyToProductHeroConfig(product) : undefined),
    [product],
  );

  const pdpBody = useMemo(
    () => (product ? shopifyToPdpBodyConfig(product) : undefined),
    [product],
  );

  const catalogProduct = useMemo(
    () => (product ? shopifyToCatalogProduct(product) : undefined),
    [product],
  );

  return {
    product,
    heroConfig,
    pdpBody,
    catalogProduct,
    isLoading: isShopifyConfigured && !isFetched && isLoading,
    isNotFound: isShopifyConfigured && isFetched && !product && !isError,
    isConfigured: isShopifyConfigured,
  };
}

export function useShopifyCollectionForPath(pathname: string) {
  const handle = collectionHandleForPath(pathname);
  const map = useShopifyCollectionsMap();
  return handle ? map.get(handle) : undefined;
}

/** Returns CatalogProducts filtered by a predicate, or [] while loading. */
export function useShopifyCatalogProducts(
  filter: (p: ShopifyProduct) => boolean,
): { products: CatalogProduct[]; isLoading: boolean; isConfigured: boolean } {
  const { data, isLoading } = useShopifyProducts();

  const products = useMemo<CatalogProduct[]>(() => {
    if (!data) return [];
    return data.filter(filter).map(shopifyToCatalogProduct);
  }, [data, filter]);

  return { products, isLoading, isConfigured: isShopifyConfigured };
}

/** All furniture products (non-rug) from Shopify. */
export function useShopifyFurnitureProducts() {
  return useShopifyCatalogProducts((p) => !isRugProduct(p));
}

/** All rug products from Shopify. */
export function useShopifyRugProducts() {
  return useShopifyCatalogProducts(isRugProduct);
}

/**
 * Name-keyed lookup map: product title (lowercase) → CatalogProduct.
 * Used by the carousel to enrich card data (real price + description)
 * while keeping curated editorial images.
 */
export function useShopifyProductMap(): Map<string, CatalogProduct> {
  const { data } = useShopifyProducts();
  return useMemo(() => {
    if (!data) return new Map();
    return buildProductNameMap(data);
  }, [data]);
}

/** Handle-keyed lookup — preferred when product titles collide (e.g. Eira Rug). */
export function useShopifyProductHandleMap(): Map<string, CatalogProduct> {
  const { data } = useShopifyProducts();
  return useMemo(() => {
    if (!data) return new Map();
    return buildProductHandleMap(data);
  }, [data]);
}

/**
 * Returns a lookup map used at checkout to resolve cart items → Shopify variant IDs.
 *
 * Key format: `"productTitle.toLowerCase()__sizeValue"`
 * - Furniture (no Size option): key = `"eira chair__"`
 * - Rug with size: key = `"dunari rug__6 ft x 7 ft"`
 * - Rug with colour + size: key = `"eira rug__5 ft x 6 ft"` (picks first available colour)
 *
 * For each size, we prefer the first `availableForSale: true` variant; if none
 * are available we still store the first variant so the cart can be created.
 */
export function useShopifyVariantMap(): Map<string, string> {
  const { data } = useShopifyProducts();
  return useMemo(() => {
    if (!data) return new Map();
    const map = new Map<string, string>();
    for (const p of data) {
      for (const v of p.variants.nodes) {
        const sizeOpt = v.selectedOptions.find((o) => o.name === "Size");
        const key = `${p.title.toLowerCase()}__${sizeOpt?.value ?? ""}`;
        // First pass: store any variant; second preference: available variants win
        if (!map.has(key) || v.availableForSale) {
          map.set(key, v.id);
        }
      }
    }
    return map;
  }, [data]);
}
