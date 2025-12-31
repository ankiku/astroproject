/* =========================================================
   SITE CONFIG (Single Source of Truth)
   ========================================================= */

export type SiteConfig = {
  title: string;
  shortTitle?: string;
  analyticsId?: string;
  publicUrl?: string;
  contactEmail?: string;
};

/* ---------------------------------------------------------
   DOMAIN CONFIG
   --------------------------------------------------------- */
export const siteConfig: Record<string, SiteConfig> = {
  "astro.local:4321": {
    title: "Astro News",
    shortTitle: "Astro",
    analyticsId: "G-AAAAAAA",
    publicUrl: "https://www.astro.news",
    contactEmail: "info@astro.news",
  },

  "germanyfinanz.news": {
    title: "Germany Finanz News",
    shortTitle: "Germany Finanz",
    analyticsId: "G-AAAAAAA",
    publicUrl: "https://www.germanyfinanz.news",
    contactEmail: "info@germanyfinanz.news",
  },

  "buschowhenley.co.uk": {
    title: "Buschow Henley",
    shortTitle: "Buschow",
    analyticsId: "G-KPZ63HRB00",
    publicUrl: "https://www.buschowhenley.co.uk",
    contactEmail: "info@buschowhenley.co.uk",
  },

  "pacificadayspa.co.uk": {
    title: "Pacifica Day Spa",
    shortTitle: "Pacifica Spa",
    analyticsId: "G-NKTWXXQV4N",
    publicUrl: "https://www.pacificadayspa.co.uk",
    contactEmail: "info@pacificadayspa.co.uk",
  },

  "thegardencafecambridge.co.uk": {
    title: "The Garden Cafe Cambridge",
    shortTitle: "The Garden Cafe",
    analyticsId: "G-T2SGVT50KX",
    publicUrl: "https://www.thegardencafecambridge.co.uk",
    contactEmail: "info@thegardencafecambridge.co.uk",
  },
};

/* ---------------------------------------------------------
   STATIC SAFE (NO REQUEST)
   --------------------------------------------------------- */
export function getStaticSite(hostname = ""): SiteConfig {
  const clean = hostname.replace(/^www\./, "");

  return (
    siteConfig[clean] || {
      title: "News",
      shortTitle: "News",
    }
  );
}

/* ---------------------------------------------------------
   RUNTIME HELPER (SSR ONLY)
   --------------------------------------------------------- */
export function getRuntimeSite(request?: Request) {
  // ❗ DEV / BUILD / HMR SAFE GUARD
  if (!request || !request.url) {
    return getStaticSite();
  }

  let url: URL;

  try {
    url = new URL(request.url);
  } catch {
    // 🚑 Prevents "Invalid URL" crash
    return getStaticSite();
  }

  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    url.hostname;

  const protocol =
    request.headers.get("cf-connecting-proto") ||
    request.headers.get("x-forwarded-proto") ||
    url.protocol.replace(":", "");

  const site = getStaticSite(host);

  return {
    ...site,
    hostname: host.replace(/^www\./, ""),
    origin: `${protocol}://${host}`,
  };
}
