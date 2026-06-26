#!/usr/bin/env node
/**
 * Attach variant images on Shopify products (PLP cards + quick-view).
 * Uses files already in Content → Files.
 *
 * Run: node shopify/set-variant-images.mjs
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadEnvFromDotenv, adminGraphql } from "./admin-auth.mjs";
import { loadFileIndex, fileEntry } from "./files-index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
loadEnvFromDotenv(readFileSync, join, __dirname);

/** Same catalog as generate-product-import.mjs */
const PRODUCTS = [
  {
    handle: "eira-rug",
    shape: "rug-color-size",
    colors: [
      { name: "Navy", image: "eira-rug-navy.webp" },
      { name: "Earth", image: "" },
    ],
  },
  { handle: "eira-table", shape: "furniture", listingImage: "listing-eira-table.webp" },
  { handle: "eira-chair", shape: "furniture", listingImage: "listing-eira-chair.webp" },
  { handle: "dunari-rug", shape: "rug-size", listingImage: "dunari-rug.webp" },
  { handle: "dunari-chair", shape: "furniture", listingImage: "listing-dunari-chair.webp" },
  { handle: "dunari-table", shape: "furniture", listingImage: "listing-dunari-table.webp" },
  { handle: "dunari-ottoman", shape: "furniture", listingImage: "listing-dunari-ottoman.webp" },
  { handle: "biophilic-rug", shape: "rug-size", listingImage: "biophilic-rug.webp" },
];

function imageForVariant(product, variant) {
  switch (product.shape) {
    case "furniture":
    case "rug-size":
      return product.listingImage;
    case "rug-color-size": {
      const color = variant.selectedOptions.find((o) => o.name === "Color")?.value;
      const match = product.colors.find((c) => c.name === color);
      return match?.image ?? "";
    }
    default:
      return "";
  }
}

async function fetchProduct(handle) {
  const data = await adminGraphql(
    `query ($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        variants(first: 50) {
          nodes {
            id
            sku
            image { id url }
            selectedOptions { name value }
          }
        }
      }
    }`,
    { handle },
  );
  return data.productByHandle;
}

async function createProductMedia(productId, sourceUrl, alt) {
  const data = await adminGraphql(
    `mutation ($productId: ID!, $media: [CreateMediaInput!]!) {
      productCreateMedia(productId: $productId, media: $media) {
        media {
          id
          ... on MediaImage { status image { url } }
        }
        mediaUserErrors { field message code }
      }
    }`,
    {
      productId,
      media: [
        {
          originalSource: sourceUrl,
          mediaContentType: "IMAGE",
          alt,
        },
      ],
    },
  );

  const errors = data.productCreateMedia.mediaUserErrors;
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join("; "));
  }

  const media = data.productCreateMedia.media[0];
  if (!media?.id) throw new Error("productCreateMedia returned no media id");
  await waitForMediaReady(media.id);
  return media.id;
}

async function waitForMediaReady(mediaId, attempts = 20) {
  for (let i = 0; i < attempts; i++) {
    const data = await adminGraphql(
      `query ($id: ID!) {
        node(id: $id) {
          ... on MediaImage { status }
          ... on Video { status }
        }
      }`,
      { id: mediaId },
    );
    const status = data.node?.status;
    if (status === "READY") return;
    if (status === "FAILED") {
      throw new Error(`Media processing failed for ${mediaId}`);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error(`Media not ready after waiting: ${mediaId}`);
}

async function appendVariantMedia(productId, variantMedia) {
  const data = await adminGraphql(
    `mutation ($productId: ID!, $variantMedia: [ProductVariantAppendMediaInput!]!) {
      productVariantAppendMedia(productId: $productId, variantMedia: $variantMedia) {
        productVariants { id }
        userErrors { field message code }
      }
    }`,
    { productId, variantMedia },
  );

  const errors = data.productVariantAppendMedia.userErrors ?? [];
  const blocking = errors.filter(
    (e) => !e.message?.includes("already has attached media"),
  );
  if (blocking.length) {
    throw new Error(blocking.map((e) => e.message).join("; "));
  }
}

async function main() {
  console.log("Loading files from Shopify…");
  const fileIndex = await loadFileIndex();
  console.log(`Indexed ${fileIndex.size} file name(s)\n`);

  for (const product of PRODUCTS) {
    const shopProduct = await fetchProduct(product.handle);
    if (!shopProduct) {
      console.warn(`Skip ${product.handle}: product not found`);
      continue;
    }

    /** filename → variant ids needing that image */
    const groups = new Map();

    for (const variant of shopProduct.variants.nodes) {
      const filename = imageForVariant(product, variant);
      if (!filename) {
        console.warn(`  ${product.handle} ${variant.sku}: no image mapped`);
        continue;
      }
      const file = fileEntry(fileIndex, filename);
      if (!file) {
        console.warn(`  ${product.handle} ${variant.sku}: file missing — ${filename}`);
        continue;
      }
      if (variant.image?.url) {
        const hasCorrect =
          variant.image.url.includes(filename.replace(".webp", "")) ||
          variant.image.url.endsWith(filename);
        if (hasCorrect) continue;
      }
      const list = groups.get(filename) ?? { file, variantIds: [] };
      list.variantIds.push(variant.id);
      groups.set(filename, list);
    }

    if (!groups.size) {
      console.log(`${product.handle}: variant images already set (or none to apply)`);
      continue;
    }

    for (const [filename, { file, variantIds }] of groups) {
      const mediaId = await createProductMedia(
        shopProduct.id,
        file.url,
        filename.replace(/\.webp$/i, ""),
      );
      await appendVariantMedia(
        shopProduct.id,
        variantIds.map((variantId) => ({ variantId, mediaIds: [mediaId] })),
      );
      console.log(
        `${product.handle}: set ${filename} on ${variantIds.length} variant(s)`,
      );
    }
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
