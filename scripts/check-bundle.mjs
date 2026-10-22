#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

/**
 * Budget limits in bytes (gzipped) defined in M07 P1.
 */
const BUDGETS = {
  entry: 160 * 1024,
  three: 380 * 1024,
  route: 60 * 1024,
  css: 25 * 1024,
};

/**
 * Classifies asset file into appropriate budget category.
 * @param {string} fileName
 * @returns {"css" | "three" | "entry" | "route"}
 */
function classifyAsset(fileName) {
  if (fileName.endsWith(".css")) return "css";
  if (fileName.includes("three") || fileName.includes("vendor-three")) return "three";
  if (fileName.startsWith("index-") || fileName.includes("main")) return "entry";
  return "route";
}

/**
 * Checks all bundle assets against defined gzip budgets.
 * @param {string} distAssetsDir
 * @returns {Array<{ name: string, category: string, rawBytes: number, gzipBytes: number, budgetBytes: number, ok: boolean }>}
 */
export function checkBundleBudgets(
  distAssetsDir = path.resolve(process.cwd(), "frontend/dist/assets")
) {
  if (!fs.existsSync(distAssetsDir)) {
    throw new Error(
      `Dist assets directory not found at: ${distAssetsDir}. Did you run 'npm run build'?`
    );
  }

  const files = fs.readdirSync(distAssetsDir).filter((f) => /\.(js|css)$/.test(f));
  const results = [];

  for (const file of files) {
    const fullPath = path.join(distAssetsDir, file);
    const rawContent = fs.readFileSync(fullPath);
    const gzipped = zlib.gzipSync(rawContent);
    const category = classifyAsset(file);
    const budgetBytes = BUDGETS[category];
    const ok = gzipped.length <= budgetBytes;

    results.push({
      name: file,
      category,
      rawBytes: rawContent.length,
      gzipBytes: gzipped.length,
      budgetBytes,
      ok,
    });
  }

  return results;
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  try {
    const results = checkBundleBudgets();
    console.log("\n📦 Bundle Budget Verification (Gzip)");
    console.log("----------------------------------------------------------------------");
    console.log(
      "File".padEnd(32) +
        "Category".padEnd(12) +
        "Gzip".padStart(10) +
        "Budget".padStart(10) +
        "   Status"
    );
    console.log("----------------------------------------------------------------------");

    let anyFailed = false;
    for (const r of results) {
      const gzipKb = (r.gzipBytes / 1024).toFixed(2) + " kB";
      const budgetKb = (r.budgetBytes / 1024).toFixed(2) + " kB";
      const status = r.ok ? "✅ PASS" : "❌ OVER BUDGET";
      if (!r.ok) anyFailed = true;

      console.log(
        r.name.padEnd(32) +
          r.category.padEnd(12) +
          gzipKb.padStart(10) +
          budgetKb.padStart(10) +
          "   " +
          status
      );
    }
    console.log("----------------------------------------------------------------------\n");

    if (anyFailed) {
      console.error("❌ Bundle budget check failed. One or more assets exceeded limits.");
      process.exit(1);
    }
    console.log("✅ All bundle chunks are within strict performance budgets.");
  } catch (err) {
    console.error(`❌ ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
  }
}
