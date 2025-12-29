export type SiteConfig = {
  title: string;
  shortTitle?: string;
  analyticsId?: string;
};

export const siteConfig: Record<string, SiteConfig> = {
  "germanyfinanz.news": {
    title: "Germany Finanz News",
    shortTitle: "Germany Finanz",
    analyticsId: "G-AAAAAAA",
  },

  "astro.local": {
    title: "Astro Local News",
    shortTitle: "Astro News",
    analyticsId: "G-BBBBBBB",
  },

  "ingridgrieveproperty.co.nz": {
    title: "Ingrid Grieve Property",
    shortTitle: "Ingrid Property",
    analyticsId: "G-CCCCCCC",
  },
};
