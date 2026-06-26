#!/usr/bin/env node
/**
 * Sets File-type product metafields via Admin GraphQL after images are in Content → Files.
 *
 * Requires in .env (repo root):
 *   SHOPIFY_STORE_DOMAIN=cornersindia.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
 *
 * Run: node shopify/set-file-metafields.mjs
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { loadEnvFromDotenv, adminGraphql } from "./admin-auth.mjs";
import { loadFileIndex } from "./files-index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

loadEnvFromDotenv(readFileSync, join, __dirname);

const FILE_KEYS = [
  "hero_image_1",
  "hero_image_2",
  "hero_background",
  "gallery_top_left",
  "gallery_bottom_left",
  "gallery_right_tall",
  "gallery_bottom_wide",
  "dimension_diagram",
];

const seed = JSON.parse(
  readFileSync(join(__dirname, "metafield-seed.json"), "utf8"),
);

async function loadFileIndexByFilename() {
  return loadFileIndex();
}

async function productIdByHandle(handle) {
  const data = await adminGraphql(
    `query ($handle: String!) {
      productByHandle(handle: $handle) { id }
    }`,
    { handle },
  );
  return data.productByHandle?.id ?? null;
}

async function setFileMetafields(ownerId, entries) {
  if (!entries.length) return;
  const data = await adminGraphql(
    `mutation ($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        userErrors { field message }
      }
    }`,
    {
      metafields: entries.map(({ key, fileGid }) => ({
        ownerId,
        namespace: "custom",
        key,
        type: "file_reference",
        value: fileGid,
      })),
    },
  );
  const errors = data.metafieldsSet.userErrors;
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join("; "));
  }
}

async function main() {
  console.log("Loading files from Shopify…");
  const fileIndex = await loadFileIndexByFilename();
  console.log(`Indexed ${fileIndex.size} files`);

  for (const [handle, fields] of Object.entries(seed.products ?? {})) {
    const ownerId = await productIdByHandle(handle);
    if (!ownerId) {
      console.warn(`Skip ${handle}: product not found`);
      continue;
    }

    const entries = [];
    for (const key of FILE_KEYS) {
      const filename = fields[key];
      if (!filename) continue;
      const fileGid = fileIndex.get(filename)?.id;
      if (!fileGid) {
        console.warn(`  ${handle}.${key}: file not found — ${filename}`);
        continue;
      }
      entries.push({ key, fileGid });
    }

    if (!entries.length) {
      console.log(`Skip ${handle}: no file metafields in seed`);
      continue;
    }

    await setFileMetafields(ownerId, entries);
    console.log(`Set ${entries.length} file metafield(s) on ${handle}`);
  }
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
