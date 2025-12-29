export type SiteConfig = {
  title: string;
  shortTitle?: string;
  analyticsId?: string;
};

/* ---------- DOMAIN CONFIG ---------- */
export const siteConfig: Record<string, SiteConfig> = {
  /* ===== Germany Finanz ===== */
  "germanyfinanz.news": {
    title: "Germany Finanz News",
    shortTitle: "Germany Finanz",
    analyticsId: "G-AAAAAAA",
  },
  "www.germanyfinanz.news": {
    title: "Germany Finanz News",
    shortTitle: "Germany Finanz",
    analyticsId: "G-AAAAAAA",
  },

  /* ===== Astro Local ===== */
  "astro.local": {
    title: "Astro Local News",
    shortTitle: "Astro News",
    analyticsId: "G-BBBBBBB",
  },

  /* ===== Buschow Henley ===== */
  "buschowhenley.co.uk": {
    title: "Buschow Henley",
    shortTitle: "Buschow",
    analyticsId: "G-CCCCCCC", // 🔁 replace if different
  },
  "www.buschowhenley.co.uk": {
    title: "Buschow Henley",
    shortTitle: "Buschow",
    analyticsId: "G-CCCCCCC",
  },

  /* ===== Pacifica Day Spa ===== */
  "pacificadayspa.co.uk": {
    title: "Pacifica Day Spa",
    shortTitle: "Pacifica Spa",
    analyticsId: "G-DDDDDDD", // 🔁 replace if different
  },
  "www.pacificadayspa.co.uk": {
    title: "Pacifica Day Spa",
    shortTitle: "Pacifica Spa",
    analyticsId: "G-DDDDDDD",
  },

  /* ===== The Garden Cafe Cambridge ===== */
  "thegardencafecambridge.co.uk": {
    title: "The Garden Cafe Cambridge",
    shortTitle: "The Garden Cafe",
    analyticsId: "G-EEEEEEE", // 🔁 replace if different
  },
  "www.thegardencafecambridge.co.uk": {
    title: "The Garden Cafe Cambridge",
    shortTitle: "The Garden Cafe",
    analyticsId: "G-EEEEEEE",
  },
};

/* ---------- SAFE SITE RESOLVER ---------- */
export function getSiteFromRequest(request?: Request) {
  try {
    if (!request) {
      return {
        title: "News",
        origin: "",
        hostname: "",
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
      origin: url.origin,
      hostname,
    };
  } catch {
    return {
      title: "News",
      origin: "",
      hostname: "",
    };
  }
}
