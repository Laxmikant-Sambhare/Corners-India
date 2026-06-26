#!/usr/bin/env node
/**
 * Generates shopify/product-import-full.csv from the master product spreadsheet.
 * Includes product metafields (text/boolean/list) from metafield-seed.json.
 * File metafields get CDN URLs in CSV (may not bind — run set-file-metafields.mjs after upload).
 *
 * Run: node shopify/generate-product-import.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CDN = "https://cdn.shopify.com/s/files/1/0990/0464/5681/files/";

const DELIVERY =
  "We deliver our pieces across India, bringing Corners directly to your home. Shipping charges are calculated on volumetric weight, and an estimated cost will appear in your cart during checkout. Delivery Time: 5 weeks";

const RETURNS =
  "Your satisfaction matters deeply to us. We encourage you to check your product upon delivery and report any concerns within 48 hours to our Customer Success team. Returns or exchanges are evaluated based on the condition of the item received. Since every piece is crafted to order, we're unable to accept cancellations or offer refunds for change of mind.";

const seed = JSON.parse(
  readFileSync(join(__dirname, "metafield-seed.json"), "utf8"),
);

/** From spreadsheet column Dimensions/Weight: 4*7, 5*8, 6*9 */
const RUG_SIZES = ["4 ft x 7 ft", "5 ft x 8 ft", "6 ft x 9 ft"];

/** Keys must match Admin definitions under custom.* */
const METAFIELD_KEYS = [
  "hero_image_1",
  "hero_image_2",
  "hero_background",
  "hero_description",
  "gallery_top_left",
  "gallery_bottom_left",
  "gallery_right_tall",
  "gallery_bottom_wide",
  "dimension_front_ft",
  "dimension_side_ft",
  "dimension_depth_ft",
  "material_bullets",
  "material_swatches",
  "delivery_copy",
  "return_copy",
  "delivery_lead_time",
  "theme",
  "show_dimensions",
  "made_to_order",
  "category_label",
  "category_path",
  "mrp_note",
];

const FILE_METAFIELD_KEYS = new Set([
  "hero_image_1",
  "hero_image_2",
  "hero_background",
  "gallery_top_left",
  "gallery_bottom_left",
  "gallery_right_tall",
  "gallery_bottom_wide",
]);

const METAFIELD_HEADERS = METAFIELD_KEYS.map(
  (key) => `product.metafields.custom.${key}`,
);

const BASE_HEADERS = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Product Category",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Option2 Name",
  "Option2 Value",
  "Variant SKU",
  "Variant Grams",
  "Variant Inventory Tracker",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Compare At Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Variant Barcode",
  "Variant Image",
  "Image Src",
  "Image Position",
  "Image Alt Text",
  "Gift Card",
  "SEO Title",
  "SEO Description",
  "Google Shopping / Google Product Category",
  "Google Shopping / Gender",
  "Google Shopping / Age Group",
  "Google Shopping / MPN",
  "Google Shopping / AdWords Grouping",
  "Google Shopping / AdWords Labels",
  "Google Shopping / Condition",
  "Google Shopping / Custom Product",
  "Google Shopping / Custom Label 0",
  "Google Shopping / Custom Label 1",
  "Google Shopping / Custom Label 2",
  "Google Shopping / Custom Label 3",
  "Google Shopping / Custom Label 4",
  "Variant Weight Unit",
  "Variant Tax Code",
  "Cost per item",
  "Status",
];

const HEADERS = [...BASE_HEADERS, ...METAFIELD_HEADERS];

/** Master data from Untitled spreadsheet - Sheet1.csv */
const PRODUCTS = [
  {
    handle: "eira-rug",
    title: "Eira Rug",
    type: "Rug",
    model: "EIRA01",
    tags: "customisable, eira, handcrafted, japendi, made-to-order, rug",
    productCategory: "Home & Garden > Decor > Rugs",
    description:
      "Inspired by rivers that cut through mountains with both patience and power, the Eira Rug brings movement to stillness. Its deep blue tones ebb and flow beneath your feet, echoing the rhythm of Himalayan streams. Every texture tells a story of journey, resilience, and quiet flow. It's not just a rug—it's a river of calm guiding you home.",
    material: "Wool & Viscose Silk",
    shape: "rug-color-size",
    colors: [
      { name: "Navy", image: "eira-rug-navy.webp" },
      { name: "Earth", image: "" },
    ],
  },
  {
    handle: "eira-table",
    title: "Eira Table",
    type: "Table",
    model: "EIRA02",
    tags: "coffee-table, eira, furniture, japendi, made-to-order, table",
    productCategory: "Furniture > Tables",
    description:
      "The Eira Coffee Table stands with the presence of a lone boulder in a high-altitude valley—grounded, enduring, unshaken. Its dark form rises like earth shaped by time, while the marble top rests upon it like a soft cloud drifting low over the mountains. Solid yet poetic, bold yet serene—it anchors the room with the same quiet power the Himalayas lend to the sky.",
    material: "Italian Marble Top\nLegs in MDF and PU finish",
    shape: "furniture",
    listingImage: "listing-eira-table.webp",
  },
  {
    handle: "eira-chair",
    title: "Eira Chair",
    type: "Chair",
    model: "EIRA03",
    tags: "boucle, chair, eira, furniture, japendi, made-to-order",
    productCategory: "Furniture > Chairs",
    description:
      "Like the first snowfall that hushes an entire valley, the Eira Lounge Chair rests in quiet grace. Its soft, sculpted curves feel as though they were carved by winter winds—gentle, effortless, pure. Sit, and the world slows down. The chaos dims. It's a moment of stillness held in the arms of warmth, a personal retreat shaped from the tranquility of fresh snow.",
    material: "Fully upholstered in high-end boucle fabric.",
    shape: "furniture",
    listingImage: "listing-eira-chair.webp",
  },
  {
    handle: "dunari-rug",
    title: "Dunari Rug",
    type: "Rug",
    model: "DUNARI01",
    tags: "customisable, dunari, handcrafted, japendi, made-to-order, rug",
    productCategory: "Home & Garden > Decor > Rugs",
    description:
      "The Dunari rug in sand color, made from viscose and wool, complements the rest of the Dunari series by embodying the serene and shifting nature of desert landscapes. One side of the rug features ripple designs, reminiscent of wind-formed patterns on dunes, capturing movement, texture, and the dynamic beauty found in nature. The opposite side presents a smooth, plain sand surface, artistically cut out with stone motifs, evoking the natural contrast between uninterrupted sands and scatterings of natural stones",
    material: "Wool & Viscose Silk",
    shape: "rug-size",
    listingImage: "dunari-rug.webp",
  },
  {
    handle: "dunari-chair",
    title: "Dunari Chair",
    type: "Chair",
    model: "DUNARI02",
    tags: "chair, dunari, furniture, japendi, made-to-order",
    productCategory: "Furniture > Chairs",
    description:
      "This chair mirrors the silhouette of wind-sculpted dunes with its soft, rounded backrest and plush seat. The curves evoke the natural contours shaped by shifting sands, offering both visual comfort and a sense of tranquility reminiscent of serene desert vistas. The base texture mimics the subtle patterns of ripples, grounding the chair in the inspiration of earthy landscapes.",
    material: "Fully upholstered in high-end fabric.\nWooden carved leg.",
    shape: "furniture",
    listingImage: "listing-dunari-chair.webp",
  },
  {
    handle: "dunari-table",
    title: "Dunari Table",
    type: "Table",
    model: "DUNARI04",
    tags: "coffee-table, dunari, furniture, japendi, made-to-order, table",
    productCategory: "Furniture > Tables",
    description:
      "With its solid surface and rounded edges, the coffee table represents the steady presence of a dune amid the ever-changing sands. The table's top features subtle wave-like patterns and a finish that reflects desert colors, effortlessly tying the set together. It stands as the central anchor, just as dunes dominate the desert horizon, blending artful inspiration with everyday utility.",
    material:
      "High Density Fiberboard\nTop & Legs in PU finish\nBrass leg screw detail",
    shape: "furniture",
    listingImage: "listing-dunari-table.webp",
  },
  {
    handle: "dunari-ottoman",
    title: "Dunari Ottoman",
    type: "Ottoman",
    model: "DUNARI03",
    tags: "dunari, furniture, japendi, made-to-order, ottoman",
    productCategory: "Furniture > Ottomans",
    description:
      "The ottoman's design is intentionally simple and inviting, echoing the gentle rise and fall of a dune crest. Its tactile upholstery and sculpted base embody the softness and movement of sand, emphasizing the organic harmony between form and function. Placing this ottoman beside the chair creates a restful haven that celebrates nature's peaceful geometry. Infused with Japandi sensibility, Dunari balances minimalism with soul. Its quiet strength and organic warmth make it ideal for interiors that seek harmony between function and feeling.",
    material:
      "Fully upholstered in high-end fabric.\nPowder coated Metal leg frame.\nIS 303 grade plywood internal framework.",
    shape: "furniture",
    listingImage: "listing-dunari-ottoman.webp",
  },
  {
    handle: "biophilic-rug",
    title: "Biophilic Rug",
    type: "Rug",
    model: "BIOPHILIC01",
    tags: "biophilic, customisable, handcrafted, japendi, made-to-order, rug",
    productCategory: "Home & Garden > Decor > Rugs",
    description:
      "A grounding piece shaped by nature's quiet rhythms. Whispers of Earth captures the warm tones of soil, stone, and sun—woven into organic lines that feel almost alive. It adds calm, texture, and a sense of rootedness to any space. A reminder that home begins where you feel connected.",
    material: "Wool & viscose Silk",
    shape: "rug-size",
    listingImage: "biophilic-rug.webp",
  },
];

function escapeCsv(value) {
  if (value == null || value === "") return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function cdnUrl(filename) {
  return filename ? `${CDN}${filename}` : "";
}

function metafieldCsvValue(key, raw) {
  if (raw == null || raw === "") return "";
  if (FILE_METAFIELD_KEYS.has(key)) {
    return typeof raw === "string" && /\.(webp|jpg|jpeg|png|gif)$/i.test(raw)
      ? cdnUrl(raw)
      : "";
  }
  if (key === "material_bullets" || key === "material_swatches") {
    if (Array.isArray(raw)) return raw.join("; ");
    return String(raw);
  }
  if (typeof raw === "boolean") return raw ? "true" : "false";
  return String(raw);
}

/** Product-level metafields — only populated on the first variant row per handle. */
function metafieldsForHandle(handle) {
  const data = seed.products?.[handle] ?? {};
  const merged = {
    delivery_copy: DELIVERY,
    return_copy: RETURNS,
    delivery_lead_time: "5 weeks",
    made_to_order: true,
    ...data,
  };
  return Object.fromEntries(
    METAFIELD_HEADERS.map((header, i) => [
      header,
      metafieldCsvValue(METAFIELD_KEYS[i], merged[METAFIELD_KEYS[i]]),
    ]),
  );
}

function materialHtml(material) {
  const lines = material
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length <= 1)
    return `<p><strong>Material:</strong> ${lines[0] ?? ""}</p>`;
  return `<p><strong>Material:</strong></p><ul>${lines.map((l) => `<li>${l}</li>`).join("")}</ul>`;
}

function bodyHtml({ description, material, model, extra }) {
  return [
    `<p>${description.trim()}</p>`,
    materialHtml(material),
    `<p><strong>Model number:</strong> ${model}</p>`,
    extra ? `<p><strong>Available sizes:</strong> ${extra}</p>` : "",
    `<p><strong>Delivery:</strong> ${DELIVERY}</p>`,
    `<p><strong>Returns:</strong> ${RETURNS}</p>`,
  ]
    .filter(Boolean)
    .join("");
}

function variantRow(partial, metafields = null) {
  const row = Object.fromEntries(HEADERS.map((h) => [h, ""]));
  Object.assign(row, {
    "Variant Grams": "0",
    "Variant Inventory Tracker": "shopify",
    "Variant Inventory Policy": "deny",
    "Variant Fulfillment Service": "manual",
    "Variant Requires Shipping": "TRUE",
    "Variant Taxable": "TRUE",
    "Variant Weight Unit": "kg",
    "Gift Card": "FALSE",
    ...partial,
  });
  if (metafields) Object.assign(row, metafields);
  return HEADERS.map((h) => escapeCsv(row[h])).join(",");
}

function sizeKey(size) {
  return size.replace(/ ft x /g, "X").replace(/ ft/g, "").replace(/ /g, "");
}

function furnitureRows(product) {
  const img = cdnUrl(product.listingImage);
  const mf = metafieldsForHandle(product.handle);
  return [
    variantRow({
      Handle: product.handle,
      Title: product.title,
      "Body (HTML)": bodyHtml(product),
      Vendor: "Corners",
      "Product Category": product.productCategory,
      Type: product.type,
      Tags: product.tags,
      Published: "TRUE",
      "Option1 Name": "Title",
      "Option1 Value": "Default Title",
      "Variant SKU": product.model,
      "Variant Price": "50000.00",
      "Variant Image": img,
      "Image Src": img,
      "Image Position": "1",
      "Image Alt Text": `${product.title} product shot`,
      "SEO Title": `${product.title} | Corners`,
      "Google Shopping / MPN": product.model,
      Status: "active",
    }, mf),
  ];
}

function rugSizeRows(product) {
  const img = cdnUrl(product.listingImage);
  const mf = metafieldsForHandle(product.handle);
  return RUG_SIZES.map((size, i) =>
    variantRow({
      Handle: product.handle,
      Title: i === 0 ? product.title : "",
      "Body (HTML)": i === 0 ? bodyHtml({ ...product, extra: RUG_SIZES.join(", ") }) : "",
      Vendor: i === 0 ? "Corners" : "",
      "Product Category": i === 0 ? product.productCategory : "",
      Type: i === 0 ? product.type : "",
      Tags: i === 0 ? product.tags : "",
      Published: i === 0 ? "TRUE" : "",
      "Option1 Name": "Size",
      "Option1 Value": size,
      "Variant SKU": `${product.model}-${sizeKey(size)}`,
      "Variant Price": "50000.00",
      "Variant Image": img,
      "Image Src": i === 0 ? img : "",
      "Image Position": i === 0 ? "1" : "",
      "Image Alt Text": i === 0 ? `${product.title} flat product shot` : "",
      "SEO Title": i === 0 ? `${product.title} | Corners` : "",
      "Google Shopping / MPN": i === 0 ? product.model : "",
      Status: i === 0 ? "active" : "",
    }, i === 0 ? mf : null),
  );
}

function rugColorSizeRows(product) {
  const rows = [];
  const mf = metafieldsForHandle(product.handle);
  let imagePosition = 1;
  for (const [colorIndex, color] of product.colors.entries()) {
    const img = cdnUrl(color.image);
    for (const [sizeIndex, size] of RUG_SIZES.entries()) {
      const isFirst = colorIndex === 0 && sizeIndex === 0;
      const isFirstOfColor = sizeIndex === 0;
      rows.push(
        variantRow({
          Handle: product.handle,
          Title: isFirst ? product.title : "",
          "Body (HTML)":
            isFirst
              ? bodyHtml({ ...product, extra: RUG_SIZES.join(", ") })
              : "",
          Vendor: isFirst ? "Corners" : "",
          "Product Category": isFirst ? product.productCategory : "",
          Type: isFirst ? product.type : "",
          Tags: isFirst ? product.tags : "",
          Published: isFirst ? "TRUE" : "",
          "Option1 Name": "Color",
          "Option1 Value": color.name,
          "Option2 Name": "Size",
          "Option2 Value": size,
          "Variant SKU": `${product.model}-${color.name.toUpperCase()}-${sizeKey(size)}`,
          "Variant Price": "50000.00",
          "Variant Image": img,
          "Image Src": isFirstOfColor && img ? img : isFirstOfColor ? "" : "",
          "Image Position": isFirstOfColor && img ? String(imagePosition++) : "",
          "Image Alt Text":
            isFirstOfColor && img ? `${product.title} ${color.name}` : "",
          "SEO Title": isFirst ? `${product.title} | Corners` : "",
          "Google Shopping / MPN": isFirst ? product.model : "",
          Status: isFirst ? "active" : "",
        }, isFirst ? mf : null),
      );
    }
  }
  return rows;
}

function productToRows(product) {
  switch (product.shape) {
    case "furniture":
      return furnitureRows(product);
    case "rug-size":
      return rugSizeRows(product);
    case "rug-color-size":
      return rugColorSizeRows(product);
    default:
      return [];
  }
}

const rows = PRODUCTS.flatMap(productToRows);
const csv = [HEADERS.join(","), ...rows].join("\n");
const outPath = join(__dirname, "product-import-full.csv");
writeFileSync(outPath, csv, "utf8");
console.log(`Wrote ${rows.length} variant rows for ${PRODUCTS.length} products → ${outPath}`);
