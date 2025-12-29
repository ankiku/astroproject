export const prerender = false;

export async function GET({ request, site }) {
  const base =
    site?.toString().replace(/\/$/, "") ||
    "https://www.germanyfinanz.news";

  let host = request.headers.get("host") || "";

  if (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes("astro.local")
  ) {
    host = "www.germanyfinanz.news";
  }

  const API_URL = `https://calcstatetax.com/api/news/?site=https://${host}`;

  const res = await fetch(API_URL, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return new Response("Failed to generate sitemap-news", { status: 500 });
  }

  const data = await res.json();
  const articles = data.articles || [];

  const entries = articles
    .map((article) => {
      const lastmod = article.created_at
        ? new Date(article.created_at).toISOString()
        : new Date().toISOString();

      return `
  <url>
    <loc>${base}/${article.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`,
    {
      headers: { "Content-Type": "application/xml" },
    }
  );
}
