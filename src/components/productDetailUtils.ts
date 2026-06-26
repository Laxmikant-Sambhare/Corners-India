import type {
  CatalogProduct,
  CatalogProductDetail,
} from "../catalog/catalogPageTypes";

const DEFAULT_SIZES = [
  "5 ft x 6 ft",
  "6 ft x 7 ft",
  "7 ft x 8 ft",
  "8 ft x 9 ft",
] as const;

const GALLERY_OPTION_PRIORITY = [
  "Color",
  "Colour",
  "Material",
  "Style",
  "Size",
] as const;

function isRugProduct(product: CatalogProduct): boolean {
  const badge = product.badge.toLowerCase();
  const name = product.name.toLowerCase();
  return badge === "rug" || name.includes("rug");
}

function fallbackSizes(product: CatalogProduct): string[] {
  return isRugProduct(product) ? [...DEFAULT_SIZES] : ["Standard"];
}

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/** Heuristic: match CDN / Shopify URLs to a variant option label (e.g. navy, earth). */
export function imageMatchesOptionValue(
  imageUrl: string,
  optionValue: string,
): boolean {
  const url = imageUrl.toLowerCase();
  const tokens = normalizeToken(optionValue).split("-").filter(Boolean);

  if (tokens.length > 0 && tokens.every((token) => url.includes(token))) {
    return true;
  }

  const aliases: Record<string, string[]> = {
    navy: ["navy", "blue"],
    earth: ["earth", "beige", "brown", "sand", "tan"],
    sand: ["sand", "beige", "earth"],
  };

  for (const token of tokens) {
    const words = aliases[token];
    if (words?.some((word) => url.includes(word))) {
      return true;
    }
  }

  return false;
}

export function pickGalleryOptionName(optionNames: Iterable<string>): string {
  const set = new Set(optionNames);
  for (const name of GALLERY_OPTION_PRIORITY) {
    if (set.has(name)) return name;
  }
  return [...set][0] ?? "Size";
}

function dedupeImages(images: string[]): string[] {
  return [...new Set(images.filter(Boolean))];
}

/** Skip promo / lifestyle assets — only variant product shots belong on cards & modal galleries. */
export function isNonProductGalleryImage(imageUrl: string): boolean {
  const url = imageUrl.toLowerCase();
  return (
    url.includes("customisation-cta") ||
    url.includes("customizations-hero") ||
    url.includes("press-as-seen") ||
    url.includes("/nav/") ||
    url.includes("logo.") ||
    url.includes("hero-lifestyle") ||
    url.includes("lifestyle-") ||
    url.includes("how-it-works") ||
    url.includes("mega-menu") ||
    url.includes("discover_hero") ||
    url.includes("hero-bg") ||
    url.includes("furniture-hero") ||
    url.includes("collection-") ||
    url.includes("discover-product-") ||
    url.includes("spotlight-")
  );
}

export function inferGalleryOptionValueFromImage(
  imageUrl: string,
  detail: CatalogProductDetail,
): string | undefined {
  const byOption = detail.galleryByOption;
  if (!byOption) return undefined;

  for (const [value, images] of Object.entries(byOption)) {
    if (images.includes(imageUrl)) return value;
  }

  for (const [value] of Object.entries(byOption)) {
    if (imageMatchesOptionValue(imageUrl, value)) return value;
  }

  return Object.keys(byOption)[0];
}

function inferGalleryOptionValue(
  product: CatalogProduct,
  detail: CatalogProductDetail,
  selectedColorLabel?: string,
): string | undefined {
  if (
    selectedColorLabel &&
    detail.galleryByOption?.[selectedColorLabel]?.length
  ) {
    return selectedColorLabel;
  }

  return inferGalleryOptionValueFromImage(product.image, detail);
}

/**
 * Returns gallery images for the active variant group.
 * When `galleryByOption` exists, filters to the selected color (or card image)
 * or the selected size when galleries are keyed by Size.
 */
export function resolveGalleryForProduct(
  product: CatalogProduct,
  detail: CatalogProductDetail,
  selectedSizeLabel?: string,
  selectedColorLabel?: string,
): string[] {
  const fallback =
    detail.gallery.length > 0
      ? detail.gallery
      : [product.image].filter(Boolean);

  const byOption = detail.galleryByOption;
  if (!byOption || Object.keys(byOption).length === 0) {
    return dedupeImages(
      fallback.filter((url) => !isNonProductGalleryImage(url)),
    );
  }

  const optionName = detail.galleryOptionName ?? "Size";
  let optionValue: string | undefined;

  if (optionName === "Color" || optionName === "Colour") {
    optionValue = inferGalleryOptionValue(product, detail, selectedColorLabel);
  } else if (
    optionName === "Size" &&
    selectedSizeLabel &&
    byOption[selectedSizeLabel]?.length
  ) {
    optionValue = selectedSizeLabel;
  } else {
    optionValue = inferGalleryOptionValue(product, detail, selectedColorLabel);
  }

  if (optionValue && byOption[optionValue]?.length) {
    return dedupeImages(byOption[optionValue]!);
  }

  return dedupeImages(fallback.filter((url) => !isNonProductGalleryImage(url)));
}

export function resolveProductDetail(
  product: CatalogProduct,
): CatalogProductDetail {
  if (product.detail) {
    const sizes =
      product.detail.sizes.length > 0
        ? product.detail.sizes
        : fallbackSizes(product);
    const gallery =
      product.detail.gallery.length > 0
        ? product.detail.gallery
        : [product.image];

    const resolvedGallery = resolveGalleryForProduct(
      product,
      { ...product.detail, gallery, sizes },
      undefined,
      product.detail.colors?.find((color) =>
        imageMatchesOptionValue(product.image, color),
      ),
    );

    return {
      ...product.detail,
      gallery: resolvedGallery.length > 0 ? resolvedGallery : gallery,
      sizes,
    };
  }
  const img = product.image;
  return {
    gallery: [img, img, img, img],
    storyTitle: `Story of ${product.name}`,
    storyBody: `${product.name} is part of the Corners assortment—selected for material honesty and lasting comfort. Ask us about finishes and lead times.`,
    sizes: fallbackSizes(product),
    mrpNote: "MRP incl. of all taxes",
  };
}

/**
 * Parses price strings like "Rs. 50,000.00" or "RS 24,500" into a clean
 * "RS 50,000" display string, and returns the numeric value for calculations.
 */
export function parsePriceValue(price: string): number {
  // Strip the currency prefix (handles "Rs.", "RS", "rs." etc.) then commas
  const numStr = price.replace(/^\s*[Rr][Ss]\.?\s*/i, "").replace(/,/g, "");
  const n = Number.parseFloat(numStr);
  return Number.isFinite(n) ? n : 0;
}

export function formatPriceShort(price: string): string {
  const n = parsePriceValue(price);
  if (n === 0) return price;
  return `RS ${Math.round(n).toLocaleString("en-IN")}`;
}
