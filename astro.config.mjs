// astro.config.mjs
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

const isCloudflare = !!process.env.CF_PAGES;

export default defineConfig({
  output: "hybrid",

  // Enable adapter only on Cloudflare Pages
  adapter: isCloudflare ? cloudflare() : undefined,

  // Cloudflare-compatible image handling
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },

  /**
   * IMPORTANT:
   * Do NOT set `site` for multi-domain projects.
   * Canonical URLs are generated per-request
   * using request.headers.host in endpoints.
   */
  site: undefined,

  vite: {
    plugins: [tailwindcss()],
    server: {
      host: true,
      allowedHosts: ["localhost", ".local"],
    },
  },
});
