import Box from "@mui/material/Box";
import { Navigate, useParams } from "@tanstack/react-router";
import {
  getProductHeroConfig,
  getProductPdpBodyConfig,
  getProductPromoConfig,
} from "../catalog/catalogPageConfig";
import { CatalogPromoCta } from "../components/CatalogPromoCta";
import { ProductDescriptionHero } from "../components/ProductDescriptionHero";
import { ProductPdpBody } from "../components/ProductPdpBody";

/**
 * `/product/$slug` — full PDP page: hero + promo CTA band.
 * Figma 990:12569 + 990:12663 + 990:12691 + 990:12692 + 990:8230.
 */
export function ProductDescriptionPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const config = getProductHeroConfig(slug);
  const promo = getProductPromoConfig(slug);
  const pdpBody = getProductPdpBodyConfig(slug);

  if (!config) {
    return <Navigate to="/" />;
  }

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
      {pdpBody ? (
        <ProductPdpBody config={pdpBody} noHeroBleed={hasBackgroundImage} />
      ) : null}
      {promo && <CatalogPromoCta {...promo} />}
    </>
  );
}
