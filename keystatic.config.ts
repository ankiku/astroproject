import { articlesKs, authorsKs } from "@/lib/keystatic";
import { config } from "@keystatic/core";

export default config({
  storage: {
    kind: "local",
  },
  ui: {
    brand: {
      name: "Astro News",
    },
    navigation: ["---", "articles", "---", "authors"],
  },
  collections: {
    articles: articlesKs,
    authors: authorsKs
  },
});
