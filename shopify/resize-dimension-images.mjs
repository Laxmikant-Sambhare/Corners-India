#!/usr/bin/env node
/**
 * Resize dimension diagram WebPs to under Shopify's 25 MP limit (width × height).
 *
 *   npm i -D sharp
 *   node shopify/resize-dimension-images.mjs
 *
 * Reads:  compressed/*-dimensions.webp
 * Writes: compressed/*-dimensions.webp (backup as *.original.webp)
 *         shopify/compressed-images-41zqiky3/*-dimensions.webp
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SRC_DIR = join(ROOT, "compressed");
const OUT_DIR = join(__dirname, "compressed-images-41zqiky3");

/** Shopify max is 25_000_000 px; stay slightly under. */
const MAX_MEGAPIXELS = 24_000_000;

async function loadSharp() {
  try {
    return (await import("sharp")).default;
  } catch {
    console.error("Install sharp first:  npm i -D sharp");
    process.exit(1);
  }
}

function targetSize(width, height) {
  let w = width;
  let h = height;
  if (w * h <= MAX_MEGAPIXELS) return { width: w, height: h };

  const scale = Math.sqrt(MAX_MEGAPIXELS / (w * h)) * 0.98;
  w = Math.max(1, Math.floor(w * scale));
  h = Math.max(1, Math.floor(h * scale));
  return { width: w, height: h };
}

async function main() {
  const sharp = await loadSharp();

  if (!existsSync(SRC_DIR)) {
    console.error(`Missing folder: ${SRC_DIR}`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });

  const files = readdirSync(SRC_DIR).filter((f) => f.endsWith("-dimensions.webp"));
  if (!files.length) {
    console.error(`No *-dimensions.webp files in ${SRC_DIR}`);
    process.exit(1);
  }

  for (const name of files.sort()) {
    const input = join(SRC_DIR, name);
    const backup = join(SRC_DIR, name.replace(".webp", ".original.webp"));
    const output = join(SRC_DIR, name);
    const copy = join(OUT_DIR, name);

    const meta = await sharp(input).metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;
    const mp = w * h;
    const { width, height } = targetSize(w, h);

    if (!existsSync(backup)) {
      copyFileSync(input, backup);
      console.log(`Backup → ${backup}`);
    }

    await sharp(backup)
      .resize(width, height, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 88, effort: 6 })
      .toFile(output);

    copyFileSync(output, copy);

    const newMp = width * height;
    console.log(
      `${name}: ${w}×${h} (${(mp / 1e6).toFixed(1)} MP) → ${width}×${height} (${(newMp / 1e6).toFixed(1)} MP)`,
    );
  }

  console.log("\nDone. Upload from shopify/compressed-images-41zqiky3/ or compressed/");
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
