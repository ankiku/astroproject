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

    // ✅ REAL HOST (works on CF Pages + Workers)
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      url.hostname;

    const hostname = host.replace(/^www\./, "");

    // ✅ REAL PROTOCOL (fixes http://localhost issue)
    const protocol =
      request.headers.get("cf-connecting-proto") ||
      request.headers.get("x-forwarded-proto") ||
      url.protocol.replace(":", "");

    const origin = `${protocol}://${host}`;

    const site =
      siteConfig[host] ||
      siteConfig[hostname] || {
        title: "News",
      };

    return {
      ...site,
      origin,
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
