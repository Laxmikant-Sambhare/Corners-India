# Corners × Shopify product setup

**Shopify-only mode:** Product cards, PDP, and quick-view read from Shopify product media + `custom.*` metafields. See **[METAFIELD-SETUP.md](./METAFIELD-SETUP.md)** and **[metafield-seed.json](./metafield-seed.json)**.

How to structure **one product** in Shopify so the Corners site (category cards, quick-view modal, cart, PDP) reads it correctly.

---

## Three layers (important)

One sellable product in Shopify is really **three buckets** of content:

| Layer | Where it lives today | What it powers |
|-------|----------------------|----------------|
| **Commerce** | Shopify product + variants | Price, SKU, cart, card thumbnail, modal size/color, variant gallery |
| **Rich PDP** | `catalogPageConfig.ts` + **`product-content-template.json`** | PDP hero images, dimensions, lifestyle grid, swatches, shipping copy |
| **Site / marketing** | Content → Files only | Home hero carousel, category banners, collection heroes, promo CTAs |

The Storefront API query does **not** fetch metafields yet — hero, dimensions, and the 4-up lifestyle grid are wired in code keyed by product **handle** (e.g. `eira-chair`). Use the JSON template as your source of truth when adding products; copy values into `catalogPageConfig.ts` until metafields are hooked up.

---

## Quick rules

| What | Where in Shopify | Used on site for |
|------|------------------|------------------|
| Flat product shot (no room, no people) | **Variant image** on each variant | Category card thumbnail |
| Extra angles of same color/size | Product media, linked to that variant | Quick-view gallery (per color) |
| PDP hero product angles (`{handle}-view1`, `-view2`) | **Files only** — not product media | PDP top hero (furniture) |
| PDP hero lifestyle background (`rug-hero-lifestyle`) | Files only | PDP top hero (rugs — full bleed) |
| PDP lifestyle grid (`{handle}-gallery-1` … `-4` or shared `lifestyle-*`) | Files only | 4-image grid below buy box |
| Category / home heroes (`furniture-hero`, `hero_img-*`) | Files only | PLP hero, home carousel — **not** per product |
| Promo banners (`customisation-cta`, etc.) | Files only | CTA sections — **not** on the product |
| Description | Product description (HTML) | Modal story + PDP copy (fallback) |
| Dimensions (W × D × H) | **Not in Shopify yet** — JSON template / code | Dimensions accordion on furniture PDPs |
| Material swatches / bullets | **Not in Shopify yet** — JSON template / code | Material accordion |
| `Type` | Product type field | Category badge + rugs vs furniture routing |
| `Size` option | Variant option 1 or 2 | Size chips in modal + cart |
| `Color` option | Variant option (exact name `Color`) | Color chips + gallery grouping for rugs |

---

## Product shapes

### Furniture (chair, table, ottoman)

```
One product
└── Option: Title → Default Title  (or no options)
    └── Variant image: listing-{handle}.webp  (flat product photo)
```

**Example:** `eira-chair`  
- Type: `Chair`  
- Tags: `furniture`, `eira`, `japendi`, `made-to-order`  
- 1 variant, 1 variant image  
- Do **not** upload lifestyle images to the product media library.

### Rugs with sizes only (e.g. Dunari Rug)

```
One product
└── Option: Size
    ├── 5 ft x 6 ft  → variant image: dunari-rug.webp
    ├── 6 ft x 7 ft  → same variant image
    ├── 7 ft x 8 ft
    └── 8 ft x 9 ft
```

- Type must be **`Rug`** (site filters `/category/rugs` by this).  
- All sizes can share the same flat variant image.  
- Option name must be exactly **`Size`**.

### Rugs with color + size (e.g. Eira Rug)

```
One product
└── Option 1: Color
│   ├── Navy  → variant image: eira-rug-navy.webp
│   └── Earth → variant image: eira-rug-earth.webp
└── Option 2: Size
    ├── 5 ft x 6 ft
    ├── 6 ft x 7 ft
    ├── 7 ft x 8 ft
    └── 8 ft x 9 ft
```

- Option 1 name must be **`Color`** (not "Colour" in CSV — both work in code, but stay consistent).  
- **Every variant row** gets the correct **Variant Image** for its color.  
- Product media: only `eira-rug-navy.webp` and `eira-rug-earth.webp` — no lifestyle files.

---

## Image naming (recommended)

Use filenames the site can match to colors:

| File | Purpose |
|------|---------|
| `listing-eira-chair.webp` | Furniture card |
| `dunari-rug.webp` | Rug card (single color) |
| `eira-rug-navy.webp` | Navy variant |
| `eira-rug-earth.webp` | Earth variant |

Avoid on products: `hero-lifestyle`, `lifestyle-*`, `customisation-cta`, `collection-*`, `furniture-hero`.

### Per-product file naming (Files → upload, link in JSON / code)

Replace `{handle}` with the product handle (`eira-chair`, `dunari-rug`, …):

| Filename | PDP / UI slot |
|----------|----------------|
| `listing-{handle}.webp` | Category card (also set as **variant image**) |
| `{handle}-view1.webp` | PDP hero — left floating product shot |
| `{handle}-view2.webp` | PDP hero — right floating product shot |
| `{handle}-gallery-1.webp` | Lifestyle grid — top left |
| `{handle}-gallery-2.webp` | Lifestyle grid — bottom left |
| `{handle}-gallery-3.webp` | Lifestyle grid — right tall |
| `{handle}-gallery-4.webp` | Lifestyle grid — bottom wide |
| `rug-hero-lifestyle.webp` | Shared full-bleed hero for **all** rug PDPs |
| `{handle}-navy.webp` / `{handle}-earth.webp` | Rug variant flat shots (variant image + quick-view) |

Furniture can reuse shared lifestyle files (`lifestyle-1.webp` … `lifestyle-4.webp`) for the grid until you shoot product-specific room sets.

---

## PDP hero & dimensions (one product, full story)

### Furniture PDP

```
Shopify product (commerce only)
├── Variant image     → listing-{handle}.webp     → card + modal
└── Description       → story copy (optional)

Content → Files (same handle prefix)
├── {handle}-view1.webp      → PDP hero image (left)
├── {handle}-view2.webp      → PDP hero image (right)
└── lifestyle-1…4 OR {handle}-gallery-1…4 → grid below buy box

Code / JSON (per handle)
├── theme, hero description
├── dimensions: frontFt, sideFt, depthFt   ← furniture only
├── materialSwatches, materialBullets
├── shippingBody, returnBody, deliveryLeadTime
└── gallery slot URLs
```

**Dimensions** are three strings shown in the accordion (front width, side width, depth/height) — e.g. `"2.62 ft"`, `"2.39 ft"`, `"2.49 ft"`. Rugs hide this section (`showDimensions: false`).

### Rug PDP

```
Shopify product
├── Color + Size variants + flat variant images
└── Description

Files
├── rug-hero-lifestyle.webp     → full-bleed PDP hero (not on product)
└── dunari-gallery-1…4 OR eira-rug-gallery-* → lifestyle grid

JSON / code
├── showDimensions: false
└── gallery + story copy
```

### Fill-in template

Copy **`product-content-template.json`**, rename to `{handle}.content.json`, and fill every field. That file is the checklist for one product’s **non-variant** assets and copy.

---

## What the site reads from Shopify

From Storefront API (`GET_ALL_PRODUCTS`):

- `title`, `handle`, `description`, `productType`, `tags`
- `featuredImage` — only used if it matches a variant image
- `images` — filtered; lifestyle/promo URLs ignored
- `variants[].selectedOptions` — `Color`, `Size`
- `variants[].image` — **primary source** for card + gallery
- `variants[].availableForSale` — size/color availability in modal

Gallery in quick-view is grouped by **Color** when present, else **Size**.

---

## Import template

Use **`product-import-full.csv`** for the full catalog (all 8 products from the master spreadsheet):

1. Upload images listed in **`product-images-upload-checklist.txt`** to Content → Files
2. Edit prices in the CSV if needed (default `50000.00` INR — spreadsheet had no prices)
3. Shopify Admin → **Products** → **Import** → upload `product-import-full.csv`
4. Publish products to your **Headless** sales channel

Regenerate the CSV after editing source data:

```bash
node shopify/generate-product-import.mjs
```

**Smaller sample:** `product-import-template.csv` (3 products only).

### What the full import includes

| Product | Handle | Variants | Images in CSV |
|---------|--------|----------|---------------|
| Eira Rug | `eira-rug` | Navy + Earth × 3 sizes | navy + earth flat shots |
| Eira Table | `eira-table` | Default Title | listing + 2 hero views |
| Eira Chair | `eira-chair` | Default Title | listing + 2 hero views |
| Dunari Rug | `dunari-rug` | 3 sizes | dunari-rug flat shot |
| Dunari Chair | `dunari-chair` | Default Title | listing only |
| Dunari Table | `dunari-table` | Default Title | listing only |
| Dunari Ottoman | `dunari-ottoman` | Default Title | listing + 2 hero views |
| Biophilic Rug | `biophilic-rug` | 3 sizes | biophilic-rug flat shot |

Rug sizes from spreadsheet: **4 ft × 7 ft**, **5 ft × 8 ft**, **6 ft × 9 ft**.

Each product body includes: description, material, model number (SKU), delivery, returns.

Template includes:

- `eira-chair` — single-variant furniture  
- `dunari-rug` — size-only rug  
- `eira-rug` — color + size rug (Navy / Earth × 4 sizes)

---

## Checklist before publish

- [ ] `Type` = `Rug` for rugs, `Chair` / `Table` / `Ottoman` for furniture  
- [ ] Handle is URL-friendly (`eira-rug`, not `Eira Rug 2`)  
- [ ] Each variant has a **Variant Image** (flat product shot)  
- [ ] Color option named **`Color`**; size option named **`Size`**  
- [ ] Size values match site copy: `5 ft x 6 ft`, `6 ft x 7 ft`, etc.  
- [ ] No lifestyle / hero / CTA images in product media  
- [ ] Product published to Headless / Online Store channel your API token can see  
- [ ] Price in INR on each variant  

---

## Optional: extra gallery angles

To add a second angle for Navy only:

1. Upload `eira-rug-navy-angle2.webp` to product media  
2. In Admin, assign that media to **all Navy variants**  
3. Filename should contain `navy` OR be set as variant image on Navy SKUs only  

The modal will show both images when **Navy** is selected.

---

## Optional: Shopify metafields (future)

When you want dimensions and hero URLs in Admin instead of code, add product metafields (namespace `custom`):

| Metafield key | Type | Example |
|---------------|------|---------|
| `hero_image_1` | file / URL | `eira-chair-view1.webp` |
| `hero_image_2` | file / URL | `eira-chair-view2.webp` |
| `hero_background` | file / URL | `rug-hero-lifestyle.webp` (rugs) |
| `gallery_top_left` … `gallery_bottom_wide` | file / URL | four lifestyle grid slots |
| `dimension_front_ft` | single line text | `2.62 ft` |
| `dimension_side_ft` | single line text | `2.39 ft` |
| `dimension_depth_ft` | single line text | `2.49 ft` |
| `material_bullets` | list.single_line_text | bullet strings |
| `delivery_lead_time` | single line text | `5 weeks` |

Expose these in the Storefront API metafield query and map them in `shopify/mappers.ts` — same shape as `ProductPdpBodyConfig` in `catalogPageTypes.ts`.
