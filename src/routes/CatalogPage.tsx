import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { getCatalogPageConfig } from "../catalog/catalogPageConfig";
import type { CatalogProduct } from "../catalog/catalogPageTypes";
import { CatalogHero } from "../components/CatalogHero";
import { CatalogPromoCta } from "../components/CatalogPromoCta";
import { FurnitureCategoryListing } from "../components/FurnitureCategoryListing";
import { furniturePagePadX, furniturePagePadY } from "../navDesignTokens";
import { isShopifyConfigured } from "../shopify/client";
import { useShopifyProducts } from "../shopify/hooks";
import { isRugProduct, shopifyToCatalogProduct } from "../shopify/mappers";
import type { ShopifyProduct } from "../shopify/types";

/** Filter Shopify products for a given catalog route. */
function filterForRoute(
  products: ShopifyProduct[],
  pathname: string,
): CatalogProduct[] {
  const isRugs      = pathname.includes("/rugs");
  const isDunari    = pathname.includes("/dunari");
  const isEira      = pathname.includes("/eira");
  const isFurniture = pathname.includes("/furniture");

  let filtered = products;

  if (isRugs) {
    filtered = products.filter(isRugProduct);
  } else {
    // All furniture-type routes exclude rugs
    filtered = products.filter((p) => !isRugProduct(p));
    if (isDunari) filtered = filtered.filter((p) => p.title.startsWith("Dunari"));
    else if (isEira) filtered = filtered.filter((p) => p.title.startsWith("Eira"));
    // isFurniture: keep all non-rug products
    void isFurniture;
  }

  return filtered.map(shopifyToCatalogProduct);
}

/**
 * Shared category / collection PLP.
 *
 * Products come from Shopify Storefront API when configured
 * (`VITE_SHOPIFY_STORE_DOMAIN` + `VITE_SHOPIFY_STOREFRONT_TOKEN` in `.env`).
 * While loading — or when Shopify is not yet configured — the page renders
 * immediately using the static mock products from `catalogPageConfig.ts`
 * so there is never a flash of empty content.
 */
export function CatalogPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const config = getCatalogPageConfig(pathname);

  const { data: shopifyProducts, isSuccess, isFetched, isLoading } =
    useShopifyProducts();

  /** Shopify when configured; static mock only without `.env` or while loading. */
  const products = useMemo<readonly CatalogProduct[]>(() => {
    if (!isShopifyConfigured) {
      return config?.products ?? [];
    }
    if (isSuccess && shopifyProducts) {
      return filterForRoute(shopifyProducts, pathname);
    }
    if (!isFetched || isLoading) {
      return config?.products ?? [];
    }
    return filterForRoute(shopifyProducts ?? [], pathname);
  }, [shopifyProducts, pathname, config, isSuccess, isFetched, isLoading]);

  if (!config) {
    const isCatalogPath =
      pathname.startsWith("/category/") || pathname.startsWith("/collections/");
    if (isCatalogPath) return <Navigate to="/" />;
    return null;
  }

  return (
    <>
      <CatalogHero {...config.hero} />
      <Box sx={{ px: furniturePagePadX, py: furniturePagePadY }}>
        <Container maxWidth="xl" disableGutters>
          <FurnitureCategoryListing
            products={products}
            sectionAriaLabel={config.listingSectionAriaLabel}
            filterThirdSectionTitle={config.listingFilterThirdSection?.title}
            filterThirdSectionOptions={config.listingFilterThirdSection?.options}
          />
        </Container>
      </Box>
      {config.promo ? <CatalogPromoCta {...config.promo} /> : null}
    </>
  );
}
