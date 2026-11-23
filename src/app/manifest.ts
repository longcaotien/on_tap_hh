import type { MetadataRoute } from "next";

// Emitted as a static file so it also works with `output: "export"` (GitHub Pages).
export const dynamic = "force-static";

// On GitHub Pages the site lives under `/<repo>`; see scripts/build-static.mjs.
const rawBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").trim();
const basePath = rawBasePath
  ? `/${rawBasePath.replace(/^\/+/, "").replace(/\/+$/, "")}`
  : "";

/**
 * Web app manifest: lets phones/tablets "Add to Home screen" and open ChemLab
 * full-screen like an app.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ChemLab 11 – Ôn luyện Lý thuyết Hóa học 11",
    short_name: "ChemLab 11",
    description:
      "Ôn tập và luyện thi 47 câu Lý thuyết Hóa 11: Sulfur, Sulfur dioxide, Sulfuric acid – Sulfate.",
    lang: "vi",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0f766e",
    categories: ["education"],
    icons: [
      {
        src: `${basePath}/icons/icon-192.png`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icons/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icons/icon-maskable-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
