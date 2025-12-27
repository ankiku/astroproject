// src/pages/sitemap.xml.ts

export const prerender = false; // 🔥 REQUIRED

export async function GET({ request, site }) {
  /* ✅ Base site URL (from astro.config.mjs) */
  const base =
    site?.toString().replace(/\/$/, "") ||
    "https://www.germanyfinanz.news";

  /* ✅ Get host from request (SSR only) */
  let host = request.headers.get("host") || "";

  /* ✅ Normalize local dev hosts */
  if (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("astro.local")
  ) {
    host = "www.germanyfinanz.news"; // backend site key
  }

  /* ✅ Django API (direct, no worker) */
  const API_URL = `https://calcstatetax.com/api/sitemap/?site=https://${host}`;

  const res = await fetch(API_URL, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return new Response("Failed to generate sitemap", { status: 500 });
  }

  const data = await res.json();
  const articles = data.articles || [];

  const urls = articles
    .map((article) => {
      const lastmod = article.created_at
        ? article.created_at.split("T")[0]
        : new Date().toISOString().split("T")[0];

      return `
  <url>
    <loc>${base}/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`,
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
}
