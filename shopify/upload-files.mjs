#!/usr/bin/env node
/**
 * Upload .webp files from shopify/compressed-images-41zqiky3 to Content → Files.
 *
 * Requires in .env:
 *   VITE_SHOPIFY_STORE_DOMAIN=cornersindia.myshopify.com
 *   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...  (write_files scope)
 *
 * Run:
 *   node shopify/upload-files.mjs
 *   node shopify/upload-files.mjs --all   # include alternates/
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname, basename } from "path";
import { fileURLToPath } from "url";
import { loadEnvFromDotenv, getStoreDomain, adminGraphql } from "./admin-auth.mjs";
import { loadFileIndex } from "./files-index.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const IMAGE_DIR = join(__dirname, "compressed-images-41zqiky3");

loadEnvFromDotenv(readFileSync, join, __dirname);

const DOMAIN = getStoreDomain();
const includeAlternates = process.argv.includes("--all");

async function loadExistingFilenames() {
  const index = await loadFileIndex();
  return new Set(index.keys());
}

function collectFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) continue;
    if (!/\.webp$/i.test(name)) continue;
    out.push(path);
  }
  return out.sort();
}

async function uploadOne(filePath) {
  const filename = basename(filePath);
  const bytes = readFileSync(filePath);
  const mimeType = "image/webp";

  const staged = await adminGraphql(
    `mutation ($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets { url resourceUrl parameters { name value } }
        userErrors { field message }
      }
    }`,
    {
      input: [
        {
          filename,
          mimeType,
          resource: "FILE",
          httpMethod: "POST",
        },
      ],
    },
  );

  const errors = staged.stagedUploadsCreate.userErrors;
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join("; "));
  }

  const target = staged.stagedUploadsCreate.stagedTargets[0];
  const form = new FormData();
  for (const p of target.parameters) {
    form.append(p.name, p.value);
  }
  form.append(
    "file",
    new Blob([bytes], { type: mimeType }),
    filename,
  );

  const uploadRes = await fetch(target.url, { method: "POST", body: form });
  if (!uploadRes.ok) {
    throw new Error(`Upload failed for ${filename}: HTTP ${uploadRes.status}`);
  }

  const created = await adminGraphql(
    `mutation ($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          id
          ... on MediaImage { image { url } }
        }
        userErrors { field message }
      }
    }`,
    {
      files: [
        {
          alt: filename.replace(/\.webp$/i, ""),
          contentType: "IMAGE",
          originalSource: target.resourceUrl,
        },
      ],
    },
  );

  const createErrors = created.fileCreate.userErrors;
  if (createErrors?.length) {
    throw new Error(createErrors.map((e) => e.message).join("; "));
  }

  const url = created.fileCreate.files[0]?.image?.url ?? target.resourceUrl;
  return { filename, url };
}

async function main() {
  const paths = collectFiles(IMAGE_DIR);
  if (includeAlternates) {
    paths.push(...collectFiles(join(IMAGE_DIR, "alternates")));
  }

  console.log(`Store: ${DOMAIN}`);
  console.log(`Found ${paths.length} local .webp file(s)`);

  const existing = await loadExistingFilenames();
  console.log(`Shopify already has ${existing.size} file(s)`);

  let uploaded = 0;
  let skipped = 0;

  for (const filePath of paths) {
    const filename = basename(filePath);
    if (existing.has(filename)) {
      console.log(`Skip (exists): ${filename}`);
      skipped++;
      continue;
    }
    process.stdout.write(`Uploading ${filename}… `);
    const result = await uploadOne(filePath);
    console.log("done");
    console.log(`  → ${result.url}`);
    existing.add(filename);
    uploaded++;
  }

  console.log(`\nDone: ${uploaded} uploaded, ${skipped} skipped`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
