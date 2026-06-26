# Import products into Shopify

File: **`product-import-full.csv`** (8 products, from master spreadsheet)

The CSV includes **text, boolean, and list metafields** from `metafield-seed.json`. **File** metafields (hero/gallery) and **variant images** (PLP cards) are set by the pipeline script after upload.

---

## Before import

### 1. Upload variant images to Files

Upload these from `compressed-images-41zqiky3/` to **Content → Files**:

| File | Used on |
|------|---------|
| `listing-eira-chair.webp` | Eira Chair variant |
| `listing-eira-table.webp` | Eira Table variant |
| `listing-dunari-chair.webp` | Dunari Chair variant |
| `listing-dunari-table.webp` | Dunari Table variant |
| `listing-dunari-ottoman.webp` | Dunari Ottoman variant |
| `dunari-rug.webp` | Dunari Rug (all sizes) |
| `eira-rug-navy.webp` | Eira Rug Navy variants |
| `biophilic-rug.webp` | Biophilic Rug (all sizes) |

**Note:** `eira-rug-earth.webp` is not in the image batch — add Earth variant image in Admin after you have the file.

### 2. Regenerate CSV (optional)

If you change prices or copy:

```bash
node shopify/generate-product-import.mjs
```

Edit prices in `generate-product-import.mjs` (`50000.00` placeholder) before regenerating.

---

## Import

1. Shopify Admin → **Products** → **Import**
2. Upload **`product-import-full.csv`**
3. Review — 8 products, rug sizes: **4 ft × 7 ft**, **5 ft × 8 ft**, **6 ft × 9 ft**
4. Publish each product to **Headless** (and Online Store if needed)

---

## After import — file metafields (hero / gallery)

1. Upload PDP images from `compressed-images-41zqiky3/` to **Content → Files** (see `IMAGE-MAPPING.md`).
2. Add to `.env`:
   ```
   SHOPIFY_STORE_DOMAIN=cornersindia.myshopify.com
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
   ```
   (Create a custom app with `write_products` scope for the token.)
3. Run (uploads files → metafields → **variant images**):
   ```bash
   node shopify/run-image-pipeline.mjs
   ```

Text metafields can also come from CSV import. Variant images and file metafields are applied by the pipeline (`set-variant-images.mjs`, `set-file-metafields.mjs`).

---

## Product summary

| Product | Handle | Variants | SKU prefix |
|---------|--------|----------|------------|
| Eira Rug | `eira-rug` | Navy + Earth × 3 sizes | EIRA01 |
| Eira Table | `eira-table` | Default Title | EIRA02 |
| Eira Chair | `eira-chair` | Default Title | EIRA03 |
| Dunari Rug | `dunari-rug` | 3 sizes | DUNARI01 |
| Dunari Chair | `dunari-chair` | Default Title | DUNARI02 |
| Dunari Ottoman | `dunari-ottoman` | Default Title | DUNARI03 |
| Dunari Table | `dunari-table` | Default Title | DUNARI04 |
| Biophilic Rug | `biophilic-rug` | 3 sizes | BIOPHILIC01 |
