import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { getCatalogPageConfig } from "../catalog/catalogPageConfig";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { CatalogHero } from "../components/CatalogHero";
import { CatalogPromoCta } from "../components/CatalogPromoCta";
import { FurnitureCategoryListing } from "../components/FurnitureCategoryListing";
import { layoutPaddingX } from "../layoutConstants";
import { furniturePagePadX, furniturePagePadY } from "../navDesignTokens";
import { isShopifyConfigured } from "../shopify/client";
import { shopifyCollectionToHeroConfig } from "../shopify/collectionMapper";
import {
  useShopifyCollectionForPath,
  useShopifyProducts,
} from "../shopify/hooks";
import { isRugProduct, shopifyToCatalogProduct } from "../shopify/mappers";
import type { ShopifyProduct } from "../shopify/types";

/** Filter Shopify products for a given catalog route. */
function filterForRoute(
  products: ShopifyProduct[],
  pathname: string,
): CatalogProduct[] {
  const isRugs = pathname.includes("/rugs");
  const isDunari = pathname.includes("/dunari");
  const isEira = pathname.includes("/eira");

  let filtered = products;

  if (isRugs) {
    filtered = products.filter(isRugProduct);
  } else {
    filtered = products.filter((p) => !isRugProduct(p));
    if (isDunari) filtered = filtered.filter((p) => p.title.startsWith("Dunari"));
    else if (isEira) filtered = filtered.filter((p) => p.title.startsWith("Eira"));
  }

  return filtered.map(shopifyToCatalogProduct);
}

/**
 * Shared category / collection PLP.
 * Products and collection heroes come from Shopify when configured.
 */
export function CatalogPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const config = getCatalogPageConfig(pathname);
  const collection = useShopifyCollectionForPath(pathname);

  const { data: shopifyProducts, isSuccess, isFetched, isLoading } =
    useShopifyProducts();

  const hero = useMemo(() => {
    if (!config) return undefined;
    if (!isShopifyConfigured) return config.hero;
    return shopifyCollectionToHeroConfig(collection, config.hero);
  }, [config, collection]);

  const products = useMemo<readonly CatalogProduct[]>(() => {
    if (!isShopifyConfigured) {
      return config?.products ?? [];
    }
    if (isSuccess && shopifyProducts) {
      return filterForRoute(shopifyProducts, pathname);
    }
    if (!isFetched || isLoading) {
      return [];
    }
    return filterForRoute(shopifyProducts ?? [], pathname);
  }, [shopifyProducts, pathname, config, isSuccess, isFetched, isLoading]);

  if (!config || !hero) {
    const isCatalogPath =
      pathname.startsWith("/category/") || pathname.startsWith("/collections/");
    if (isCatalogPath) return <Navigate to="/" />;
    return null;
  }

  return (
    <>
      <CatalogHero {...hero} />
      <Box
        sx={{
          px: { xs: layoutPaddingX.xs, sm: layoutPaddingX.sm, md: furniturePagePadX },
          py: { xs: 2.5, sm: 3.5, md: furniturePagePadY },
        }}
      >
        <Container maxWidth="xl" disableGutters>
          <FurnitureCategoryListing
            products={products}
            sectionAriaLabel={config.listingSectionAriaLabel}
            filterMode={pathname.includes("/rugs") ? "size" : "productType"}
          />
        </Container>
      </Box>
      {config.promo ? <CatalogPromoCta {...config.promo} /> : null}
    </>
  );
}
