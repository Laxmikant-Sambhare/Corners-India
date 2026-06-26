import type { CatalogProduct } from "../catalog/catalogPageTypes";
import {
  imageMatchesOptionValue,
  inferGalleryOptionValueFromImage,
  isNonProductGalleryImage,
  pickGalleryOptionName,
} from "../components/productDetailUtils";
import {
  indexMetafields,
  metafieldString,
  PRODUCT_METAFIELD_KEYS,
} from "./metafields";
import type { ShopifyProduct } from "./types";

/** Format a Shopify money amount string as INR display value. */
export function formatINR(amount: string): string {
  const n = parseFloat(amount);
  return `Rs. ${n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function buildGalleryByOption(p: ShopifyProduct): {
  galleryOptionName: string;
  galleryByOption: Record<string, string[]>;
} | null {
  const variants = p.variants.nodes;
  if (variants.length === 0) return null;

  const optionName = pickGalleryOptionName(
    variants.flatMap((v) => v.selectedOptions.map((o) => o.name)),
  );

  const optionValues = [
    ...new Set(
      variants
        .map((v) => v.selectedOptions.find((o) => o.name === optionName)?.value)
        .filter((value): value is string => Boolean(value)),
    ),
  ];

  if (optionValues.length === 0) return null;

  const productImages = p.images.nodes
    .map((img) => img.url)
    .filter((url) => Boolean(url) && !isNonProductGalleryImage(url));
  const galleryByOption: Record<string, string[]> = {};

  for (const value of optionValues) {
    const urls = new Set<string>();

    for (const variant of variants) {
      if (
        variant.selectedOptions.find((o) => o.name === optionName)?.value !==
        value
      ) {
        continue;
      }
      if (
        variant.image?.url &&
        !isNonProductGalleryImage(variant.image.url)
      ) {
        urls.add(variant.image.url);
      }
    }

    for (const imgUrl of productImages) {
      const variantsForImage = variants.filter(
        (v) => v.image?.url === imgUrl,
      );
      if (variantsForImage.length > 0) {
        const exclusiveToValue = variantsForImage.every(
          (v) =>
            v.selectedOptions.find((o) => o.name === optionName)?.value ===
            value,
        );
        if (exclusiveToValue) urls.add(imgUrl);
      } else if (imageMatchesOptionValue(imgUrl, value)) {
        urls.add(imgUrl);
      }
    }

    galleryByOption[value] = [...urls];
  }

  return { galleryOptionName: optionName, galleryByOption };
}

function collectColorOptions(p: ShopifyProduct): {
  colors: string[];
  availableColors?: string[];
} {
  const seen = new Set<string>();
  const colors: string[] = [];
  const availableColorSet = new Set<string>();

  for (const v of p.variants.nodes) {
    const colorOpt = v.selectedOptions.find(
      (o) => o.name === "Color" || o.name === "Colour",
    );
    if (!colorOpt) continue;
    if (!seen.has(colorOpt.value)) {
      seen.add(colorOpt.value);
      colors.push(colorOpt.value);
    }
    if (v.availableForSale) {
      availableColorSet.add(colorOpt.value);
    }
  }

  return {
    colors,
    availableColors:
      colors.length > 0 ? colors.filter((c) => availableColorSet.has(c)) : undefined,
  };
}

/** Card / listing image — always a variant product shot, never lifestyle or promo art. */
function resolveVariantListingImage(p: ShopifyProduct): string {
  const variants = p.variants.nodes;
  const variantImageUrls = new Set(
    variants
      .map((v) => v.image?.url)
      .filter((url): url is string => Boolean(url && !isNonProductGalleryImage(url))),
  );

  const availableVariant = variants.find(
    (v) =>
      v.availableForSale &&
      v.image?.url &&
      !isNonProductGalleryImage(v.image.url),
  );
  if (availableVariant?.image?.url) return availableVariant.image.url;

  const anyVariant = variants.find(
    (v) => v.image?.url && !isNonProductGalleryImage(v.image.url),
  );
  if (anyVariant?.image?.url) return anyVariant.image.url;

  const featured = p.featuredImage?.url;
  if (featured && variantImageUrls.has(featured)) return featured;

  for (const img of p.images.nodes) {
    if (img.url && variantImageUrls.has(img.url)) return img.url;
  }

  return "";
}

/** Convert a Shopify product into the `CatalogProduct` shape the UI expects. */
export function shopifyToCatalogProduct(p: ShopifyProduct): CatalogProduct {
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
  const { colors, availableColors } = collectColorOptions(p);

  const shopifyGallery = p.images.nodes
    .map((img) => img.url)
    .filter((url) => Boolean(url) && !isNonProductGalleryImage(url));
  const variantGalleries = buildGalleryByOption(p);
  const listingImage = resolveVariantListingImage(p);
  const featuredGalleryKey =
    variantGalleries && listingImage
      ? inferGalleryOptionValueFromImage(listingImage, {
          gallery: [],
          storyTitle: "",
          storyBody: "",
          sizes: [],
          galleryOptionName: variantGalleries.galleryOptionName,
          galleryByOption: variantGalleries.galleryByOption,
        })
      : undefined;
  const gallery =
    featuredGalleryKey &&
    variantGalleries?.galleryByOption[featuredGalleryKey]?.length
      ? variantGalleries.galleryByOption[featuredGalleryKey]!
      : listingImage
        ? [listingImage]
        : shopifyGallery;
  const image = listingImage || gallery[0] || "";

  const availableForSale = p.variants.nodes.some((v) => v.availableForSale);
  const mf = indexMetafields(p.metafields);

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
      sizes: sizes.length > 0 ? sizes : [],
      availableSizes,
      colors: colors.length > 0 ? colors : undefined,
      availableColors,
      galleryOptionName: variantGalleries?.galleryOptionName,
      galleryByOption: variantGalleries?.galleryByOption,
      mrpNote:
        metafieldString(mf, PRODUCT_METAFIELD_KEYS.mrpNote) ||
        "MRP incl. of all taxes",
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
