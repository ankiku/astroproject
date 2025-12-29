export type SiteConfig = {
  title: string;
  shortTitle?: string;
  analyticsId?: string;
};

/* ---------- DOMAIN CONFIG ---------- */
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

/* ---------- SAFE SITE RESOLVER ---------- */
export function getSiteFromRequest(request?: Request) {
  try {
    if (!request) {
      return {
        title: "News",
        origin: "",
      };
    }

    const url = new URL(request.url);
    const rawHost = url.hostname;
    const hostname = rawHost.replace(/^www\./, "");

    const site =
      siteConfig[rawHost] ||
      siteConfig[hostname] || {
        title: "News",
      };

    return {
      ...site,
      origin: url.origin,   // ✅ THIS IS WHAT YOU NEED
      hostname,
    };
  } catch {
    return {
      title: "News",
      origin: "",
    };
  }
}
