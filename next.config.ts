import type { NextConfig } from "next";

/**
 * Two deployment targets share this config:
 *
 * - Node/server build (default): full Next.js app with route handlers.
 * - Static export (`STATIC_EXPORT=1`, used for GitHub Pages): HTML/CSS/JS only.
 *
 * On GitHub Pages a project site is served from `/<repo-name>`, so the base
 * path is injected through `NEXT_PUBLIC_BASE_PATH` by `scripts/build-static.mjs`.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim().replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
      ...(basePath ? { basePath, assetPrefix: basePath } : {}),
    }
  : {};

export default nextConfig;
