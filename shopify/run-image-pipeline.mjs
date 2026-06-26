#!/usr/bin/env node
/**
 * Upload primary images from compressed-images-41zqiky3, then set file metafields.
 *
 *   node shopify/run-image-pipeline.mjs
 *   node shopify/run-image-pipeline.mjs --all   # upload alternates too
 */

import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const extraArgs = process.argv.slice(2);

function run(script) {
  const res = spawnSync(process.execPath, [join(__dirname, script), ...extraArgs], {
    stdio: "inherit",
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

console.log("Step 1/3 — upload files to Shopify Content → Files\n");
run("upload-files.mjs");

console.log("\nStep 2/3 — link file metafields on products\n");
run("set-file-metafields.mjs");

console.log("\nStep 3/3 — attach variant images on products\n");
run("set-variant-images.mjs");

console.log("\nImage pipeline complete.");
