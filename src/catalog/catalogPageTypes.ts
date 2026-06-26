/** PDP quick-view content (Figma 990:8629). When omitted, the modal derives sensible defaults from `image` + `name`. */
export type CatalogProductDetail = {
  /** Gallery order: index 0 is the default hero; include 4+ extras for thumbnails. */
  gallery: string[];
  storyTitle: string;
  storyBody: string;
  sizes: string[];
  /**
   * Subset of `sizes` that have at least one variant with availableForSale: true.
   * When undefined, all sizes are treated as available (static / non-Shopify products).
   */
  availableSizes?: string[];
  /** Option name used to group gallery images (e.g. Color, Size). */
  galleryOptionName?: string;
  /** Gallery images keyed by `galleryOptionName` value. */
  galleryByOption?: Record<string, string[]>;
  /** Color option values when the product has a Color variant axis. */
  colors?: string[];
  /** Subset of `colors` that have at least one variant with availableForSale: true. */
  availableColors?: string[];
  mrpNote?: string;
};

export type CatalogProduct = {
  badge: string;
  name: string;
  price: string;
  image: string;
  /** False when all variants have zero stock. Defaults to true for static products. */
  availableForSale?: boolean;
  detail?: CatalogProductDetail;
};

export type CatalogHeroConfig = {
  sectionAriaLabel: string;
  title: string;
  breadcrumbCurrent: string;
  description: string;
  heroImageSrc: string;
  heroImageObjectPosition?: string;
};

export type CatalogPromoConfig = {
  title: string;
  body: string;
  imageSrc: string;
  ctaLabel: string;
  ctaTo: string;
  imageObjectPosition?: string;
  flipImage?: boolean;
};

/** Third PLP filter column — Figma furniture: Product Type; rugs 990:6185: Size. */
export type CatalogListingFilterThirdSection = {
  title: string;
  options: readonly string[];
};

export type CatalogPageConfig = {
  path: string;
  hero: CatalogHeroConfig;
  products: readonly CatalogProduct[];
  listingSectionAriaLabel: string;
  /** When set, overrides the third accordion (default: Product Type + furniture chips). */
  listingFilterThirdSection?: CatalogListingFilterThirdSection;
  promo: CatalogPromoConfig | null;
};

/** Lifestyle grid below hero — Figma 990:14339. */
export type ProductPdpGalleryConfig = {
  topLeft: string;
  bottomLeft: string;
  rightTall: string;
  bottomWide: string;
};

/** Buy box + accordions — Figma 990:14514. */
export type ProductPdpBodyConfig = {
  /** Shown on the “Made to order” pill. */
  madeToOrder?: boolean;
  price: string;
  mrpNote?: string;
  /** Swatch labels (e.g. fabric names). */
  materialSwatches: readonly string[];
  /** Long copy for the Product description accordion. */
  productDescription: string;
  /** Bullets for the Material accordion. */
  materialBullets: readonly string[];
  dimensions: {
    frontFt: string;
    sideFt: string;
    depthFt: string;
  };
  shippingBody: string;
  deliveryLeadTime?: string;
  returnBody: string;
  /** e.g. “Monday, 29 April” */
  expectedDelivery?: string;
  gallery: ProductPdpGalleryConfig;
  /** When false, hides the Dimensions accordion (e.g. rugs). Default true. */
  showDimensions?: boolean;
};

/** Full PDP hero data — Figma 990:12663 + product images. */
export type ProductHeroConfig = {
  slug: string;
  productName: string;
  /** Breadcrumb middle segment, e.g. "Furniture". */
  categoryLabel: string;
  categoryPath: string;
  /** Badge label, e.g. "Japendi". */
  theme?: string;
  description: string;
  heroImages: string[];
  /** Full-bleed lifestyle photo behind the text (rugs PDP — Figma 990:11896). When set, product images are hidden. */
  heroBackgroundImage?: string;
  /** When set, drives gallery + buy box below hero; otherwise derived in `getProductPdpBodyConfig`. */
  pdpBody?: ProductPdpBodyConfig;
};
