import type {
  CatalogPageConfig,
  CatalogProduct,
  CatalogPromoConfig,
  ProductHeroConfig,
  ProductPdpBodyConfig,
} from "./catalogPageTypes";
import { furnitureCustomisationImageObjectPosition } from "../navDesignTokens";
import { CDN_PRODUCTS, CDN_GALLERY, CDN_HEROES, CDN_LIFESTYLE } from "../shopify/cdnImages";

const HERO_DEFAULT = CDN_HEROES["furniture-hero"];

/** Same art treatment as the furniture PLP promo (mirrored photo + crop) on every catalog route. */
const PROMO_VISUAL_BASE = {
  imageSrc: CDN_LIFESTYLE["customisation-cta"],
  flipImage: true,
  imageObjectPosition: furnitureCustomisationImageObjectPosition,
} as const;

const COPY_FURNITURE =
  "Corners is about emotional connection with personal spaces—especially the overlooked corners of a home. It's rooted in the belief that every corner holds a story—the places where life slows down and presence is felt.";

const COPY_RUGS =
  "Discover rugs that ground a room—texture, warmth, and pattern chosen to live with you. Each piece is selected to pair with Corners furniture and your own story.";

const COPY_DUNARI =
  "Dunari brings sculptural calm and tactile finishes. Explore chairs, tables, and accents from this limited collection—crafted to anchor dining and living spaces.";

const COPY_EIRA =
  "Eira pairs clean lines with inviting materials. Browse seating and tables from the Eira family—designed to mix with Corners collections across your home.";

const FURNITURE_PRODUCTS: CatalogProduct[] = [
  {
    badge: "Chair",
    name: "Eira Chair",
    price: "Rs. 50,000.00",
    image: CDN_PRODUCTS["listing-eira-chair"],
  },
  {
    badge: "Chair",
    name: "Dunari Chair",
    price: "Rs. 50,000.00",
    image: CDN_PRODUCTS["listing-dunari-chair"],
  },
  {
    badge: "Ottoman",
    name: "Dunari Ottoman",
    price: "Rs. 50,000.00",
    image: CDN_PRODUCTS["listing-dunari-ottoman"],
  },
  {
    badge: "Table",
    name: "Dunari Table",
    price: "Rs. 50,000.00",
    image: CDN_PRODUCTS["listing-dunari-table"],
  },
  {
    badge: "Table",
    name: "Eira Table",
    price: "Rs. 50,000.00",
    image: CDN_PRODUCTS["listing-eira-table"],
  },
];

/** Figma 990:6185 — rugs PLP; 990:8629 — quick-view modal gallery + copy for Dunari. */
const RUGS_PRODUCTS: CatalogProduct[] = [
  {
    badge: "Rug",
    name: "Dunari Rug",
    price: "Rs. 50,000.00",
    image: CDN_PRODUCTS["dunari-rug"],
    detail: {
      gallery: [
        CDN_GALLERY["dunari-gallery-1"],
        CDN_GALLERY["dunari-gallery-2"],
        CDN_GALLERY["dunari-gallery-3"],
        CDN_GALLERY["dunari-gallery-4"],
      ],
      storyTitle: "Story of Dunari Rug",
      storyBody:
        "The Dunari rug in sand color, made from viscose and wool, complements the rest of the Dunari series by embodying the serene and tactile language of the collection—crafted to sit quietly beneath furniture while adding warmth and texture.",
      sizes: ["5 ft x 6 ft", "6 ft x 7 ft", "7 ft x 8 ft", "8 ft x 9 ft"],
      mrpNote: "MRP incl. of all taxes",
    },
  },
  {
    badge: "Rug",
    name: "Eira Rug",
    price: "Rs. 50,000.00",
    image: CDN_PRODUCTS["eira-rug-navy"],
    detail: {
      gallery: [
        CDN_PRODUCTS["eira-rug-navy"],
      ],
      galleryOptionName: "Color",
      galleryByOption: {
        Navy: [CDN_PRODUCTS["eira-rug-navy"]],
        Earth: [CDN_PRODUCTS["eira-rug-earth"]],
      },
      colors: ["Navy", "Earth"],
      storyTitle: "Story of Eira Rug",
      storyBody:
        "Deep navy ground with cream organic lines—this Eira rug layers pattern without overpowering the room. Pair with light woods and neutral upholstery from the Eira family.",
      sizes: ["5 ft x 6 ft", "6 ft x 7 ft", "7 ft x 8 ft", "8 ft x 9 ft"],
      mrpNote: "MRP incl. of all taxes",
    },
  },
  {
    badge: "Rug",
    name: "Eira Rug",
    price: "Rs. 50,000.00",
    image: CDN_PRODUCTS["eira-rug-earth"],
    detail: {
      gallery: [
        CDN_PRODUCTS["eira-rug-earth"],
      ],
      galleryOptionName: "Color",
      galleryByOption: {
        Navy: [CDN_PRODUCTS["eira-rug-navy"]],
        Earth: [CDN_PRODUCTS["eira-rug-earth"]],
      },
      colors: ["Navy", "Earth"],
      storyTitle: "Story of Eira Rug",
      storyBody:
        "Earthy tones and organic veining bring quiet movement underfoot. Designed to bridge natural materials across the Corners range.",
      sizes: ["5 ft x 6 ft", "6 ft x 7 ft", "7 ft x 8 ft", "8 ft x 9 ft"],
      mrpNote: "MRP incl. of all taxes",
    },
  },
];

const DUNARI_COLLECTION_PRODUCTS: CatalogProduct[] = FURNITURE_PRODUCTS.filter(
  (p) => p.name.startsWith("Dunari"),
);

const EIRA_COLLECTION_PRODUCTS: CatalogProduct[] = FURNITURE_PRODUCTS.filter(
  (p) => p.name.startsWith("Eira"),
);

const PROMO_CUSTOMISATION: CatalogPromoConfig = {
  ...PROMO_VISUAL_BASE,
  title: "Customisation at Corners",
  body: "At Corners, we offer thoughtful, limited-scope customisation to maintain design integrity and craftsmanship.",
  ctaLabel: "Know More",
  ctaTo: "/customizations",
};

/** Figma 990:14339 — shared lifestyle grid for furniture PDPs. */
const PDP_LIFESTYLE_GRID = {
  topLeft: CDN_GALLERY["lifestyle-1"],
  bottomLeft: CDN_GALLERY["lifestyle-2"],
  rightTall: CDN_GALLERY["lifestyle-3"],
  bottomWide: CDN_GALLERY["lifestyle-4"],
} as const;

/** Placeholder dimensions for PDPs without bespoke specs — matches Figma 990:14590–14605. */
const PDP_DEFAULT_DIMENSIONS_MOCK = {
  frontFt: "2.62 ft",
  sideFt: "2.39 ft",
  depthFt: "2.49 ft",
} as const;

const PDP_COPY_SHIPPING = `We deliver our pieces across India, bringing Corners directly to your home. Shipping charges are calculated on volumetric weight, and an estimated cost will appear in your cart during checkout.`;

const PDP_COPY_RETURN = `Your satisfaction matters deeply to us. We encourage you to check your product upon delivery and report any concerns within 48 hours to our Customer Success team. Returns or exchanges are evaluated based on the condition of the item received. Since every piece is crafted to order, we're unable to accept cancellations or offer refunds for change of mind.`;

const EIRA_LOUNGE_PDP_BODY: ProductPdpBodyConfig = {
  madeToOrder: true,
  price: "Rs. 50,000.00",
  mrpNote: "MRP incl. of all taxes",
  materialSwatches: ["Material", "Material", "Material", "Material"],
  productDescription:
    "This chair mirrors the silhouette of wind-sculpted dunes with its soft, rounded backrest and plush seat. The curves evoke the natural contours shaped by shifting sands, offering both visual comfort and a sense of tranquility reminiscent of serene desert vistas. The base texture mimics the subtle patterns of ripples, grounding the chair in the inspiration of earthy landscapes.",
  materialBullets: [
    "Fully upholstered in high-end fabric.",
    "Teak wood carved legs.",
  ],
  dimensions: { ...PDP_DEFAULT_DIMENSIONS_MOCK },
  shippingBody: PDP_COPY_SHIPPING,
  deliveryLeadTime: "5 weeks",
  returnBody: PDP_COPY_RETURN,
  expectedDelivery: "Monday, 29 April",
  gallery: { ...PDP_LIFESTYLE_GRID },
  showDimensions: true,
};

const CATALOG_PAGES: Record<string, CatalogPageConfig> = {
  "/category/furniture": {
    path: "/category/furniture",
    hero: {
      sectionAriaLabel: "Furniture",
      title: "Furniture",
      breadcrumbCurrent: "Furniture",
      description: COPY_FURNITURE,
      heroImageSrc: HERO_DEFAULT,
      heroImageObjectPosition: "50% 42%",
    },
    products: FURNITURE_PRODUCTS,
    listingSectionAriaLabel: "Furniture products",
    promo: PROMO_CUSTOMISATION,
  },
  "/category/rugs": {
    path: "/category/rugs",
    hero: {
      sectionAriaLabel: "Rugs",
      title: "Rugs",
      breadcrumbCurrent: "Rugs",
      description: COPY_RUGS,
      heroImageSrc: HERO_DEFAULT,
      heroImageObjectPosition: "50% 48%",
    },
    products: RUGS_PRODUCTS,
    listingSectionAriaLabel: "Rugs products",
    promo: {
      ...PROMO_VISUAL_BASE,
      title: "Made to live with your layout",
      body: "Need sizing or finish notes? Our team can guide rug pairing with furniture you already love—visit customisations to explore what is possible.",
      ctaLabel: "Explore customisations",
      ctaTo: "/customizations",
    },
  },
  "/collections/dunari": {
    path: "/collections/dunari",
    hero: {
      sectionAriaLabel: "Dunari collection",
      title: "Dunari",
      breadcrumbCurrent: "Dunari",
      description: COPY_DUNARI,
      heroImageSrc: CDN_HEROES["collection-dunari-hero"],
      heroImageObjectPosition: "50% 45%",
    },
    products: DUNARI_COLLECTION_PRODUCTS,
    listingSectionAriaLabel: "Dunari collection products",
    promo: {
      ...PROMO_VISUAL_BASE,
      title: "The Dunari edit",
      body: "Limited pieces and finishes—ask us about lead times or coordinating sets across dining and living.",
      ctaLabel: "Shop the story",
      ctaTo: "/discover",
    },
  },
  "/collections/eira": {
    path: "/collections/eira",
    hero: {
      sectionAriaLabel: "Eira collection",
      title: "Eira",
      breadcrumbCurrent: "Eira",
      description: COPY_EIRA,
      heroImageSrc: HERO_DEFAULT,
      heroImageObjectPosition: "50% 44%",
    },
    products: EIRA_COLLECTION_PRODUCTS,
    listingSectionAriaLabel: "Eira collection products",
    promo: {
      ...PROMO_VISUAL_BASE,
      title: "Eira in your space",
      body: "Pair Eira seating with tables from the same line—or let us suggest complementary Corners pieces.",
      ctaLabel: "Discover pairings",
      ctaTo: "/discover",
    },
  },
};

export function getCatalogPageConfig(
  pathname: string,
): CatalogPageConfig | undefined {
  return CATALOG_PAGES[pathname];
}

/** Flat list of all static products with their category label — used by the search index. */
export const CATALOG_PAGES_SEARCH_INDEX: Array<{
  name: string;
  price: string;
  image: string;
  category: string;
}> = [
  ...FURNITURE_PRODUCTS.map((p) => ({ ...p, category: "Furniture" })),
  ...RUGS_PRODUCTS.map((p) => ({ ...p, category: "Rugs" })),
];

/** Resolve full `CatalogProduct` (incl. `detail`) when `image` matches a PLP product. */
export function findCatalogProductByImage(
  imageSrc: string,
): CatalogProduct | undefined {
  for (const config of Object.values(CATALOG_PAGES)) {
    const hit = config.products.find((p) => p.image === imageSrc);
    if (hit) return hit;
  }
  return undefined;
}

/** Turn product name → URL slug, e.g. "Eira Lounge Chair" → "eira-lounge-chair". */
export function toProductSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const PRODUCT_HERO_CONFIGS: ProductHeroConfig[] = [
  {
    slug: "eira-lounge-chair",
    productName: "Eira Lounge Chair",
    categoryLabel: "Furniture",
    categoryPath: "/category/furniture",
    theme: "Japandi",
    description:
      "This chair mirrors the silhouette of wind-sculpted dunes with its soft, rounded backrest and plush seat.",
    heroImages: [
      CDN_PRODUCTS["eira-chair-view1"],
      CDN_PRODUCTS["eira-chair-view2"],
    ],
    pdpBody: EIRA_LOUNGE_PDP_BODY,
  },
  {
    slug: "eira-chair",
    productName: "Eira Chair",
    categoryLabel: "Furniture",
    categoryPath: "/category/furniture",
    theme: "Japandi",
    description:
      "The Eira chair pairs clean lines with inviting materials—designed to anchor living spaces with sculptural calm.",
    heroImages: [
      CDN_PRODUCTS["eira-chair-view1"],
      CDN_PRODUCTS["eira-chair-view2"],
    ],
  },
  {
    slug: "dunari-chair",
    productName: "Dunari Chair",
    categoryLabel: "Furniture",
    categoryPath: "/category/furniture",
    theme: "Japandi",
    description:
      "Dunari brings sculptural calm and tactile finishes—crafted to anchor dining and living spaces.",
    heroImages: [
      CDN_PRODUCTS["eira-chair-view1"],
      CDN_PRODUCTS["eira-chair-view2"],
    ],
  },
  {
    slug: "dunari-ottoman",
    productName: "Dunari Ottoman",
    categoryLabel: "Furniture",
    categoryPath: "/category/furniture",
    theme: "Japandi",
    description:
      "The ottoman's design is intentionally simple and inviting, echoing the gentle rise and fall of a dune crest.",
    heroImages: [
      CDN_PRODUCTS["dunari-ottoman-view1"],
      CDN_PRODUCTS["dunari-ottoman-view2"],
    ],
  },
  {
    slug: "dunari-table",
    productName: "Dunari Table",
    categoryLabel: "Furniture",
    categoryPath: "/category/furniture",
    theme: "Japandi",
    description:
      "The Dunari table grounds any room with its sculptural base and tactile wood finish.",
    heroImages: [
      CDN_PRODUCTS["eira-chair-view1"],
      CDN_PRODUCTS["eira-chair-view2"],
    ],
  },
  {
    slug: "eira-table",
    productName: "Eira Table",
    categoryLabel: "Furniture",
    categoryPath: "/category/furniture",
    theme: "Japandi",
    description:
      "Light woods and organic forms—the Eira table sits comfortably in living rooms and reading nooks.",
    heroImages: [
      CDN_PRODUCTS["eira-chair-view1"],
      CDN_PRODUCTS["eira-chair-view2"],
    ],
  },
  {
    slug: "dunari-rug",
    productName: "Dunari Rug",
    categoryLabel: "Rugs",
    categoryPath: "/category/rugs",
    theme: "Japandi",
    description:
      "The Dunari rug in sand color, made from viscose and wool—crafted to sit quietly beneath furniture while adding warmth and texture.",
    heroImages: [],
    heroBackgroundImage: CDN_PRODUCTS["rug-hero-lifestyle"],
  },
  {
    slug: "eira-rug",
    productName: "Eira Rug",
    categoryLabel: "Rugs",
    categoryPath: "/category/rugs",
    theme: "Japandi",
    description:
      "Inspired by rivers that cut through mountains with both patience and power, the Eira Rug brings movement to stillness.",
    heroImages: [],
    heroBackgroundImage: CDN_PRODUCTS["rug-hero-lifestyle"],
  },
];

export function getProductHeroConfig(
  slug: string,
): ProductHeroConfig | undefined {
  return PRODUCT_HERO_CONFIGS.find((c) => c.slug === slug);
}

/** Resolve the promo band for a PDP by looking up its parent category/collection page. */
export function getProductPromoConfig(slug: string): CatalogPromoConfig | null {
  const hero = getProductHeroConfig(slug);
  if (!hero) return null;
  const parent = CATALOG_PAGES[hero.categoryPath];
  return parent?.promo ?? PROMO_CUSTOMISATION;
}

export function findCatalogProductBySlug(
  slug: string,
): CatalogProduct | undefined {
  for (const config of Object.values(CATALOG_PAGES)) {
    const hit = config.products.find((p) => toProductSlug(p.name) === slug);
    if (hit) return hit;
  }
  return undefined;
}

function buildDefaultPdpBody(
  hero: ProductHeroConfig,
  product?: CatalogProduct,
): ProductPdpBodyConfig {
  const detail = product?.detail;
  const isRug = hero.categoryPath.includes("/rugs");
  const gallery =
    detail && detail.gallery.length >= 4
      ? {
          topLeft: detail.gallery[0]!,
          bottomLeft: detail.gallery[1]!,
          rightTall: detail.gallery[2]!,
          bottomWide: detail.gallery[3]!,
        }
      : {
          topLeft: PDP_LIFESTYLE_GRID.topLeft,
          bottomLeft: PDP_LIFESTYLE_GRID.bottomLeft,
          rightTall: hero.heroImages[1] ?? hero.heroImages[0]!,
          bottomWide: PDP_LIFESTYLE_GRID.bottomWide,
        };

  return {
    madeToOrder: true,
    price: product?.price ?? "Rs. 50,000.00",
    mrpNote: detail?.mrpNote ?? "MRP incl. of all taxes",
    materialSwatches: [],
    productDescription:
      detail?.storyBody ??
      `${hero.description} Explore finishes and lead times with our team.`,
    materialBullets: isRug
      ? [
          "High-quality fibres selected for durability and hand.",
          "Designed to pair with Corners furniture collections.",
        ]
      : [
          "Fully upholstered in high-end fabric.",
          "Solid wood base with hand-finished detail.",
        ],
    dimensions: { ...PDP_DEFAULT_DIMENSIONS_MOCK },
    shippingBody: PDP_COPY_SHIPPING,
    deliveryLeadTime: "5 weeks",
    returnBody: PDP_COPY_RETURN,
    expectedDelivery: "Monday, 29 April",
    gallery,
    showDimensions: !isRug,
  };
}

export function getProductPdpBodyConfig(
  slug: string,
): ProductPdpBodyConfig | undefined {
  const hero = getProductHeroConfig(slug);
  if (!hero) return undefined;
  if (hero.pdpBody) return hero.pdpBody;
  const product = findCatalogProductBySlug(slug);
  return buildDefaultPdpBody(hero, product);
}

/** Build a PDP hero config dynamically from any `CatalogProduct` when no hand-crafted entry exists. */
export function resolveProductHeroConfig(
  product: CatalogProduct,
  categoryLabel = "Furniture",
  categoryPath = "/category/furniture",
): ProductHeroConfig {
  const slug = toProductSlug(product.name);
  const existing = getProductHeroConfig(slug);
  if (existing) return existing;
  return {
    slug,
    productName: product.name,
    categoryLabel,
    categoryPath,
    description:
      product.detail?.storyBody ??
      `${product.name} is part of the Corners assortment—selected for material honesty and lasting comfort.`,
    heroImages: product.detail?.gallery.slice(0, 2) ?? [product.image],
  };
}
