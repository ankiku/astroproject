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
  const API_URL = `https://calcstatetax.com/api/news/?site=https://${host}`;

  const res = await fetch(API_URL, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return new Response("Failed to generate sitemap", { status: 500 });
  }

  const data = await res.json();
  const articles = data.articles || [];

  const items = articles
    .map((article) => {
      const pubDate = article.created_at
        ? new Date(article.created_at).toUTCString()
        : "";

      return `
  <item>
    <title><![CDATA[${article.title}]]></title>
    <link>${base}/${article.slug}</link>
    <guid>${base}/${article.slug}</guid>
    <pubDate>${pubDate}</pubDate>
  </item>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Latest News</title>
  <link>${base}</link>
  <description>Latest news updates</description>
  <language>es</language>
${items}
</channel>
</rss>`,
    {
      headers: {
        "Content-Type": "application/rss+xml",
      },
    }
  );
}
