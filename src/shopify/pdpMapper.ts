import type {
  ProductHeroConfig,
  ProductPdpBodyConfig,
} from "../catalog/catalogPageTypes";
import {
  indexMetafields,
  metafieldBoolean,
  metafieldImageUrl,
  metafieldString,
  metafieldStringList,
  PRODUCT_METAFIELD_KEYS,
} from "./metafields";
import { formatINR, isRugProduct } from "./mappers";
import type { ShopifyProduct } from "./types";

export function getProductMetafields(p: ShopifyProduct) {
  return indexMetafields(p.metafields);
}

export function shopifyToProductHeroConfig(
  p: ShopifyProduct,
): ProductHeroConfig {
  const mf = getProductMetafields(p);
  const rug = isRugProduct(p);

  const heroBackground = metafieldImageUrl(
    mf,
    PRODUCT_METAFIELD_KEYS.heroBackground,
  );
  const hero1 = metafieldImageUrl(mf, PRODUCT_METAFIELD_KEYS.heroImage1);
  const hero2 = metafieldImageUrl(mf, PRODUCT_METAFIELD_KEYS.heroImage2);
  const heroImages = [hero1, hero2].filter(Boolean);

  const categoryLabel =
    metafieldString(mf, PRODUCT_METAFIELD_KEYS.categoryLabel) ||
    (rug ? "Rugs" : "Furniture");
  const categoryPath =
    metafieldString(mf, PRODUCT_METAFIELD_KEYS.categoryPath) ||
    (rug ? "/category/rugs" : "/category/furniture");

  const description =
    metafieldString(mf, PRODUCT_METAFIELD_KEYS.heroDescription) ||
    p.description.trim();

  return {
    slug: p.handle,
    productName: p.title,
    categoryLabel,
    categoryPath,
    theme: metafieldString(mf, PRODUCT_METAFIELD_KEYS.theme) || undefined,
    description,
    heroImages: heroBackground ? [] : heroImages,
    heroBackgroundImage: heroBackground || undefined,
  };
}

export function shopifyToPdpBodyConfig(
  p: ShopifyProduct,
): ProductPdpBodyConfig {
  const mf = getProductMetafields(p);
  const rug = isRugProduct(p);

  const topLeft = metafieldImageUrl(mf, PRODUCT_METAFIELD_KEYS.galleryTopLeft);
  const bottomLeft = metafieldImageUrl(
    mf,
    PRODUCT_METAFIELD_KEYS.galleryBottomLeft,
  );
  const rightTall = metafieldImageUrl(
    mf,
    PRODUCT_METAFIELD_KEYS.galleryRightTall,
  );
  const bottomWide = metafieldImageUrl(
    mf,
    PRODUCT_METAFIELD_KEYS.galleryBottomWide,
  );

  const hero1 = metafieldImageUrl(mf, PRODUCT_METAFIELD_KEYS.heroImage1);
  const hero2 = metafieldImageUrl(mf, PRODUCT_METAFIELD_KEYS.heroImage2);

  const gallery = {
    topLeft: topLeft || hero1,
    bottomLeft: bottomLeft || hero2,
    rightTall: rightTall || hero2 || hero1,
    bottomWide: bottomWide || hero1,
  };

  const materialBullets = metafieldStringList(
    mf,
    PRODUCT_METAFIELD_KEYS.materialBullets,
  );
  const materialSwatches = metafieldStringList(
    mf,
    PRODUCT_METAFIELD_KEYS.materialSwatches,
  );

  const showDimensions =
    metafieldBoolean(mf, PRODUCT_METAFIELD_KEYS.showDimensions) ?? !rug;

  const madeToOrder =
    metafieldBoolean(mf, PRODUCT_METAFIELD_KEYS.madeToOrder) ??
    p.tags.some((t) => t.toLowerCase().includes("made-to-order"));

  return {
    madeToOrder,
    price: formatINR(p.priceRange.minVariantPrice.amount),
    mrpNote:
      metafieldString(mf, PRODUCT_METAFIELD_KEYS.mrpNote) ||
      "MRP incl. of all taxes",
    materialSwatches,
    productDescription: p.description.trim(),
    materialBullets:
      materialBullets.length > 0
        ? materialBullets
        : rug
          ? [
              "High-quality fibres selected for durability and hand.",
              "Designed to pair with Corners furniture collections.",
            ]
          : [
              "Fully upholstered in high-end fabric.",
              "Solid wood base with hand-finished detail.",
            ],
    dimensions: {
      frontFt:
        metafieldString(mf, PRODUCT_METAFIELD_KEYS.dimensionFrontFt) || "—",
      sideFt:
        metafieldString(mf, PRODUCT_METAFIELD_KEYS.dimensionSideFt) || "—",
      depthFt:
        metafieldString(mf, PRODUCT_METAFIELD_KEYS.dimensionDepthFt) || "—",
      diagramUrl:
        metafieldImageUrl(mf, PRODUCT_METAFIELD_KEYS.dimensionDiagram) ||
        undefined,
    },
    shippingBody: metafieldString(mf, PRODUCT_METAFIELD_KEYS.deliveryCopy),
    deliveryLeadTime:
      metafieldString(mf, PRODUCT_METAFIELD_KEYS.deliveryLeadTime) || undefined,
    returnBody: metafieldString(mf, PRODUCT_METAFIELD_KEYS.returnCopy),
    gallery,
    showDimensions,
  };
}
