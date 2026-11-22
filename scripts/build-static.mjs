#!/usr/bin/env node
/**
 * Build a fully static copy of the app for GitHub Pages.
 *
 * Next.js static export (`output: "export"`) cannot contain route handlers, but
 * this repo keeps them so the app can also run on a Node host with PostgreSQL.
 * This script therefore:
 *   1. temporarily moves `src/app/api` out of the way,
 *   2. runs `next build` with `output: export` + the localStorage backend,
 *   3. restores the API folder (always, even if the build fails).
 *
 * Usage:
 *   node scripts/build-static.mjs                    # custom domain / user site
 *   NEXT_PUBLIC_BASE_PATH=/on_tap_hh node scripts/build-static.mjs   # project site
 */
import { existsSync, mkdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const apiDir = path.join(root, "src", "app", "api");
const stashDir = path.join(root, ".static-build");
const stashedApi = path.join(stashDir, "api");
const outDir = path.join(root, "out");

const rawBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
const basePath = rawBasePath
  ? `/${rawBasePath.replace(/^\/+/, "").replace(/\/+$/, "")}`
  : "";

function restoreApi() {
  if (existsSync(stashedApi)) {
    rmSync(apiDir, { recursive: true, force: true });
    mkdirSync(path.dirname(apiDir), { recursive: true });
    renameSync(stashedApi, apiDir);
    console.log("✓ restored src/app/api");
  }
  rmSync(stashDir, { recursive: true, force: true });
}

console.log(
  `▶ static export${basePath ? ` with basePath "${basePath}"` : " (no basePath)"}`
);

let moved = false;
if (existsSync(apiDir)) {
  rmSync(stashDir, { recursive: true, force: true });
  mkdirSync(stashDir, { recursive: true });
  renameSync(apiDir, stashedApi);
  moved = true;
  console.log("• temporarily moved src/app/api out of the build");
}

// Make sure the folder comes back no matter how we exit.
process.on("exit", () => {
  if (moved) restoreApi();
});
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    restoreApi();
    process.exit(1);
  });
}

const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const result = spawnSync(process.execPath, [nextBin, "build"], {
  stdio: "inherit",
  env: {
    ...process.env,
    STATIC_EXPORT: "1",
    NEXT_PUBLIC_OFFLINE_STORE: "1",
    NEXT_PUBLIC_BASE_PATH: basePath,
    // The database is never touched by a static build.
    DATABASE_URL: process.env.DATABASE_URL || "postgres://unused:unused@localhost:5432/unused",
  },
});

if (moved) {
  restoreApi();
  moved = false;
}

if (result.status !== 0) {
  console.error("✗ static export failed");
  process.exit(result.status ?? 1);
}

// GitHub Pages serves the artifact as-is; `.nojekyll` keeps `_next/` assets safe
// when the branch-based (Jekyll) publishing method is used instead of Actions.
writeFileSync(path.join(outDir, ".nojekyll"), "");
console.log(`✓ static site ready in ${path.relative(root, outDir)}/`);
