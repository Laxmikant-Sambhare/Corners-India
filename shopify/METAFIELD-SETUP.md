# Shopify metafield setup (Corners)

Create these in **Shopify Admin → Settings → Custom data** before the site can show PDP heroes, dimensions, and gallery grids from Shopify.

For every definition: enable **Storefront API access** → `Public read`.

Namespace for all fields: **`custom`** (Shopify’s default — you’ll see `custom.hero_image_1` in Admin; that’s correct)

---

## Product metafields

| Key | Type | Used for |
|-----|------|----------|
| `hero_image_1` | File | PDP hero — left product shot (furniture) |
| `hero_image_2` | File | PDP hero — right product shot (furniture) |
| `hero_background` | File | PDP full-bleed hero (rugs) |
| `hero_description` | Single line text | Short hero paragraph (optional; falls back to product description) |
| `gallery_top_left` | File | Lifestyle grid slot 1 |
| `gallery_bottom_left` | File | Lifestyle grid slot 2 |
| `gallery_right_tall` | File | Lifestyle grid slot 3 |
| `gallery_bottom_wide` | File | Lifestyle grid slot 4 |
| `dimension_front_ft` | Single line text | e.g. `2.62 ft` |
| `dimension_side_ft` | Single line text | e.g. `2.39 ft` |
| `dimension_depth_ft` | Single line text | e.g. `2.49 ft` |
| `material_bullets` | List · Single line text | Material accordion bullets |
| `material_swatches` | List · Single line text | Swatch labels under buy box |
| `delivery_copy` | Multi-line text | Shipping accordion |
| `return_copy` | Multi-line text | Returns accordion |
| `delivery_lead_time` | Single line text | e.g. `5 weeks` |
| `theme` | Single line text | Badge e.g. `Japendi` |
| `show_dimensions` | True or false | `false` for rugs |
| `made_to_order` | True or false | Made-to-order pill |
| `category_label` | Single line text | Breadcrumb e.g. `Furniture` |
| `category_path` | Single line text | Breadcrumb link e.g. `/category/furniture` |
| `mrp_note` | Single line text | e.g. `MRP incl. of all taxes` |

**Variant images** (flat product shots) stay on each variant — used for PLP cards and quick-view.

---

## Collection metafields

Create collections with handles: **`furniture`**, **`rugs`**, **`dunari`**, **`eira`**.

| Key | Type | Used for |
|-----|------|----------|
| `hero_image` | File | Category / collection PLP hero banner |
| `hero_description` | Multi-line text | Hero body copy |
| `hero_object_position` | Single line text | CSS object-position e.g. `50% 42%` |

If collection metafields are empty, the site falls back to static copy in `catalogPageConfig.ts` for heroes only.

---

## Seed values

See **`metafield-seed.json`** — copy values into each product/collection in Admin (or bulk-import via Matrixify / Shopify API).

After metafields are set:

1. Import products with **`product-import-full.csv`**
2. Attach **variant images** on each SKU
3. Set product metafields from the seed file
4. Publish products + collections to **Headless** channel

---

## What the site reads now

| UI | Source |
|----|--------|
| PLP product cards | Shopify variant images only (no CDN fallback) |
| Quick-view modal | Variant images + product description |
| PDP hero + buy box + gallery | Product metafields + description |
| Category hero | Collection metafields (static fallback for copy/image) |
| Home carousel, promos | Still static / Files (not product metafields) |
