// src/config/site-map.ts
export const SITE_BY_DOMAIN: Record<string, {
  title: string;
  locale: string;
}> = {
  "www.germanyfinanz.news": {
    title: "Germany Finanz News",
    locale: "de-DE",
  },
  "ingridgrieveproperty.co.nz": {
    title: "Ingrid Grieve Property News",
    locale: "en-NZ",
  },
  "default": {
    title: "Astro News",
    locale: "en-US",
  },
};
