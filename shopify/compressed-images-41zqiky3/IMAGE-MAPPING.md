# Image rename map — compressed-images-41zqiky3

**Renamed in place** (original `compressed-*` names removed).

- **`compressed-images-41zqiky3/`** — 22 primary Shopify filenames (upload these)
- **`compressed-images-41zqiky3/alternates/`** — 39 extra shots

---

## Primary files (upload to Shopify)

| Shopify filename | Source file | Product / metafield use |
|------------------|-------------|-------------------------|
| `listing-dunari-chair.webp` | compressed-001.webp | Variant image · Dunari Chair |
| `listing-eira-chair.webp` | compressed-DSC09817 002.webp | Variant image · Eira Chair |
| `listing-eira-table.webp` | compressed-Layer 1 002.webp | Variant image · Eira Table |
| `listing-dunari-table.webp` | compressed-DSC00049 001.webp | Variant image · Dunari Table *(tray-top side table)* |
| `listing-dunari-ottoman.webp` | compressed-Layer 005.webp | Variant image · Dunari Ottoman |
| `dunari-ottoman-view1.webp` | compressed-Layer 004.webp | Metafield `hero_image_1` · Dunari Ottoman |
| `dunari-ottoman-view2.webp` | compressed-DSC00070 001.webp | Metafield `hero_image_2` · Dunari Ottoman |
| `eira-chair-view1.webp` | compressed-DSC00464-Edit copy.webp | Metafield `hero_image_1` · Eira Chair |
| `eira-chair-view2.webp` | compressed-DSC00452.webp | Metafield `hero_image_2` · Eira Chair |
| `dunari-rug.webp` | compressed-DSC09985 001.webp | Variant image · Dunari Rug |
| `eira-rug-navy.webp` | compressed-DSC09850 copy 001.webp | Variant image · Eira Rug (Navy) |
| `biophilic-rug.webp` | compressed-DSC00082 001.webp | Variant image · Biophilic Rug |
| `collection-dunari-hero.webp` | compressed-DSC00142-Edit copy.webp | Collection metafield `hero_image` · dunari |
| `dunari-gallery-1.webp` … `-4.webp` | DSC00176, 00187, 00121, 00197 | Metafields `gallery_*` · Dunari Rug |
| `rug-hero-lifestyle.webp` | compressed-DSC00265 copy.webp | Metafield `hero_background` · all rugs |
| `lifestyle-1.webp` … `lifestyle-4.webp` | DSC00273, 00279, 00295, 00374 | Shared furniture gallery metafields |

---

## Missing from this batch

| Filename | Status |
|----------|--------|
| **`eira-rug-earth.webp`** | Not in folder — need separate Earth-color flat shot |
| **`furniture-hero.webp`** | Not in folder — category hero still uses existing CDN file |

---

## Metafield assignment quick guide

### Eira Chair
- Variant image → `listing-eira-chair.webp`
- `hero_image_1` → `eira-chair-view1.webp`
- `hero_image_2` → `eira-chair-view2.webp`
- `gallery_*` → `lifestyle-1` … `lifestyle-4` (or Eira lifestyle alternates)

### Dunari Chair
- Variant image → `listing-dunari-chair.webp`
- `gallery_*` → dunari-gallery or lifestyle images

### Eira / Dunari tables
- Variant images → `listing-eira-table.webp`, `listing-dunari-table.webp`

### Dunari Ottoman
- Variant image → `listing-dunari-ottoman.webp`
- `hero_image_1/2` → `dunari-ottoman-view1/2.webp`

### Rugs
- Variant images → `dunari-rug`, `eira-rug-navy`, `biophilic-rug`
- `hero_background` → `rug-hero-lifestyle.webp`
- Dunari rug gallery → `dunari-gallery-1` … `4`

---

## Notes

1. **`listing-dunari-table.webp`** is the tray-top side table shot (`DSC00049`). If your Dunari Table SKU is the wave-pattern coffee table, that flat shot may still be missing — check alternates or reshoot.
2. **39 duplicate/alternate** files kept in `alternates/` with `{product}__{description}.webp` names.
3. Upload **`shopify-upload/renamed/*.webp`** to **Shopify Admin → Content → Files**, then attach in product metafields and variant images.
