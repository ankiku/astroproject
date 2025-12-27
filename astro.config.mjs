// astro.config.mjs
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

const isCloudflare = !!process.env.CF_PAGES;

export default defineConfig({
  output: "hybrid",

  // ✅ Enable adapter ONLY on Cloudflare Pages
  adapter: isCloudflare ? cloudflare() : undefined,

  // ✅ Disable Sharp (Cloudflare compatible)
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },

  site: isCloudflare
    ? process.env.CF_PAGES_URL
    : "http://localhost:4321",

  vite: {
    plugins: [tailwindcss()],
    server: {
      host: true,
      allowedHosts: ["localhost", ".local"],
    },
  },
});
