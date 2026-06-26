import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, useParams } from "@tanstack/react-router";
import {
  getProductHeroConfig,
  getProductPdpBodyConfig,
  getProductPromoConfig,
  findCatalogProductBySlug,
} from "../catalog/catalogPageConfig";
import { CatalogPromoCta } from "../components/CatalogPromoCta";
import { ProductDescriptionHero } from "../components/ProductDescriptionHero";
import { ProductPdpBody } from "../components/ProductPdpBody";
import { isShopifyConfigured } from "../shopify/client";
import { useShopifyProductByHandle } from "../shopify/hooks";

/**
 * `/product/$slug` — full PDP page: hero + promo CTA band.
 * Shopify is the source of truth when configured; static config is dev-only fallback.
 */
export function ProductDescriptionPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };

  const shopify = useShopifyProductByHandle(slug);

  const staticHero = getProductHeroConfig(slug);
  const staticPdpBody = getProductPdpBodyConfig(slug);
  const staticCatalog = findCatalogProductBySlug(slug);

  const config = isShopifyConfigured ? shopify.heroConfig : staticHero;
  const pdpBody = isShopifyConfigured ? shopify.pdpBody : staticPdpBody;
  const catalogProduct = isShopifyConfigured
    ? shopify.catalogProduct
    : staticCatalog;

  const promo = getProductPromoConfig(slug);

  if (isShopifyConfigured && shopify.isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress sx={{ color: "#bc7e5a" }} />
      </Box>
    );
  }

  if (isShopifyConfigured && shopify.isNotFound) {
    return <Navigate to="/" />;
  }

  if (!config || !pdpBody) {
    return <Navigate to="/" />;
  }

  const wishlistProduct = catalogProduct ?? {
    badge: config.theme ?? config.categoryLabel,
    name: config.productName,
    price: pdpBody.price,
    image: config.heroImages[0] ?? config.heroBackgroundImage ?? "",
  };

  const hasBackgroundImage = Boolean(config.heroBackgroundImage);

  return (
    <>
      <ProductDescriptionHero {...config} />
      {!hasBackgroundImage && (
        <Box
          sx={{
            display: { xs: "none", md: "block" },
          }}
        />
      )}
      <ProductPdpBody
        config={pdpBody}
        wishlistProduct={wishlistProduct}
        noHeroBleed={hasBackgroundImage}
      />
      {promo && <CatalogPromoCta {...promo} />}
    </>
  );
}
