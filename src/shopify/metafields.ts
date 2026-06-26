/** Corners product & collection metafields — namespace `custom` (Shopify default), Storefront: PUBLIC_READ. */

export const CORNERS_NAMESPACE = "custom";

export const PRODUCT_METAFIELD_KEYS = {
  heroImage1: "hero_image_1",
  heroImage2: "hero_image_2",
  heroBackground: "hero_background",
  galleryTopLeft: "gallery_top_left",
  galleryBottomLeft: "gallery_bottom_left",
  galleryRightTall: "gallery_right_tall",
  galleryBottomWide: "gallery_bottom_wide",
  dimensionFrontFt: "dimension_front_ft",
  dimensionSideFt: "dimension_side_ft",
  dimensionDepthFt: "dimension_depth_ft",
  dimensionDiagram: "dimension_diagram",
  materialBullets: "material_bullets",
  materialSwatches: "material_swatches",
  deliveryCopy: "delivery_copy",
  returnCopy: "return_copy",
  deliveryLeadTime: "delivery_lead_time",
  theme: "theme",
  showDimensions: "show_dimensions",
  madeToOrder: "made_to_order",
  categoryLabel: "category_label",
  categoryPath: "category_path",
  mrpNote: "mrp_note",
  heroDescription: "hero_description",
} as const;

export const COLLECTION_METAFIELD_KEYS = {
  heroImage: "hero_image",
  heroDescription: "hero_description",
  heroObjectPosition: "hero_object_position",
} as const;

export type ShopifyMetafieldRef = {
  image?: { url: string } | null;
};

export type ShopifyMetafield = {
  key: string;
  value: string;
  type: string;
  reference?: ShopifyMetafieldRef | null;
};

export type ShopifyMetafieldMap = Map<string, ShopifyMetafield>;

export function buildMetafieldIdentifiers(
  keys: readonly string[],
): Array<{ namespace: string; key: string }> {
  return keys.map((key) => ({ namespace: CORNERS_NAMESPACE, key }));
}

export const PRODUCT_METAFIELD_IDENTIFIERS = buildMetafieldIdentifiers(
  Object.values(PRODUCT_METAFIELD_KEYS),
);

export const COLLECTION_METAFIELD_IDENTIFIERS = buildMetafieldIdentifiers(
  Object.values(COLLECTION_METAFIELD_KEYS),
);

export function indexMetafields(
  nodes: ShopifyMetafield[] | null | undefined,
): ShopifyMetafieldMap {
  const map = new Map<string, ShopifyMetafield>();
  for (const mf of nodes ?? []) {
    if (mf?.key) map.set(mf.key, mf);
  }
  return map;
}

/** Resolve a file_reference or URL metafield to a public image URL. */
export function metafieldImageUrl(
  map: ShopifyMetafieldMap,
  key: string,
): string {
  const mf = map.get(key);
  if (!mf) return "";
  const refUrl = mf.reference?.image?.url;
  if (refUrl) return refUrl;
  const value = mf.value.trim();
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  return "";
}

export function metafieldString(map: ShopifyMetafieldMap, key: string): string {
  return map.get(key)?.value.trim() ?? "";
}

export function metafieldBoolean(
  map: ShopifyMetafieldMap,
  key: string,
): boolean | undefined {
  const raw = metafieldString(map, key).toLowerCase();
  if (raw === "true" || raw === "1") return true;
  if (raw === "false" || raw === "0") return false;
  return undefined;
}

/** Parse list.single_line_text_field JSON or newline-separated fallback. */
export function metafieldStringList(
  map: ShopifyMetafieldMap,
  key: string,
): string[] {
  const raw = metafieldString(map, key);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
  } catch {
    /* plain text / newline list */
  }
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
