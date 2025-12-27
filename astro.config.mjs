// astro.config.mjs
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

const isDev = import.meta.env.MODE === "development";

export default defineConfig({
  output: "hybrid",

  // ❌ Do not use Cloudflare adapter in dev (Windows safe)
  adapter: isDev ? undefined : cloudflare(),

  // ✅ Disable Sharp (Cloudflare compatible)
  image: {
    service: {
      entrypoint: "astro/assets/services/noop",
    },
  },

  site: isDev
    ? "http://localhost:4321"
    : "https://www.germanyfinanz.news",

  vite: {
    plugins: [tailwindcss()],
    server: {
      host: true,
      allowedHosts: ["localhost", ".local"],
    },
  },
});
