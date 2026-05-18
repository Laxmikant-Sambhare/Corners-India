/**
 * One-shot: resize + WebP for raster assets under public/.
 * Run: node scripts/optimize-public-images.mjs
 * Requires: npm i -D sharp
 */
import { mkdir, stat } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const root = join(fileURLToPath(new URL("..", import.meta.url)));
const pub = join(root, "public");

/** Paths relative to public/, max width (px), WebP quality 0–100 */
const JOBS = [
  { rel: "hero/hero_img-1.png", maxW: 2560, q: 85 },
  { rel: "hero/hero_img-2.png", maxW: 2560, q: 85 },
  { rel: "hero/hero_img-3.png", maxW: 2560, q: 85 },
  { rel: "discover/product-1.png", maxW: 1200, q: 85 },
  { rel: "discover/product-2.png", maxW: 1200, q: 85 },
  { rel: "discover/product-3.png", maxW: 1200, q: 85 },
  { rel: "discover/product-4.png", maxW: 1200, q: 85 },
  { rel: "discover/product-5.png", maxW: 1200, q: 85 },
  { rel: "collections/hero-lifestyle.jpg", maxW: 2200, q: 85 },
  { rel: "collections/spotlight-chair.png", maxW: 1200, q: 85 },
  { rel: "explore/rugs.jpg", maxW: 1800, q: 85 },
  { rel: "explore/furniture.jpg", maxW: 1800, q: 85 },
  { rel: "explore/mega-menu-feature.jpg", maxW: 1600, q: 85 },
];

async function run() {
  for (const { rel, maxW, q } of JOBS) {
    const input = join(pub, rel);
    const outRel = rel.replace(/\.(png|jpe?g)$/i, ".webp");
    const output = join(pub, outRel);

    await mkdir(dirname(output), { recursive: true });

    const img = sharp(input);
    const meta = await img.metadata();
    const width = meta.width ?? maxW;
    const pipeline =
      width > maxW
        ? img.resize({ width: maxW, withoutEnlargement: true })
        : img;

    await pipeline.webp({ quality: q, effort: 6 }).toFile(output);

    const inStat = await stat(input);
    const outStat = await stat(output);
    console.log(
      `${rel} → ${outRel} (${(inStat.size / 1e6).toFixed(2)} MB → ${(outStat.size / 1e6).toFixed(2)} MB)`,
    );
  }
  console.log("Done.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
