export const prerender = false; // 🔥 REQUIRED (SSR)

export async function GET({ request, site }) {
  /* ✅ Base site URL (from astro.config.mjs) */
  const base =
    site?.toString().replace(/\/$/, "") ||
    "https://www.germanyfinanz.news";

  /* ✅ Get host from request */
  let host = request.headers.get("host") || "";

  /* ✅ Normalize local dev hosts */
  if (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("astro.local")
  ) {
    host = "www.germanyfinanz.news";
  }

  /* ✅ Django API */
  const API_URL = `https://calcstatetax.com/api/news/?site=https://${host}`;

  const res = await fetch(API_URL, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return new Response("Failed to generate sitemap", { status: 500 });
  }

  const data = await res.json();
  const articles = data.articles || [];

  /* ✅ Static URLs (important) */
  const staticUrls = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terma-and-conditions",
    "/disclaimer",
    "/contact-us",
    "/sitemap.xml",
    "/rss.xml",
  ];

  const staticEntries = staticUrls
    .map((path) => {
      return `
  <url>
    <loc>${base}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("");

  /* ✅ Dynamic article URLs */
  const articleEntries = articles
    .map((article) => {
      const lastmod = article.created_at
        ? new Date(article.created_at).toISOString()
        : "";

      return `
  <url>
    <loc>${base}/${article.slug}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
>
${staticEntries}
${articleEntries}
</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml",
      },
    }
  );
}
