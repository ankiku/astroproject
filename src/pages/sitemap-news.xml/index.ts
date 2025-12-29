export const prerender = false;

/* ✅ Base URL for sitemap output (multi-domain safe) */
function getBaseURL(request: Request) {
  const host = request.headers.get("host");

  // Local dev fallback
  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return "http://localhost:4321";
  }

  return `https://${host}`;
}

/* ✅ Site key for Django API */
function getApiSite(request: Request) {
  const host = request.headers.get("host");

  // Local dev → use registered site
  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return "https://www.germanyfinanz.news";
  }

  // Production → actual domain
  return `https://${host}`;
}

export async function GET({ request }) {
  const base = getBaseURL(request);
  const apiSite = getApiSite(request);

  const API_URL = `https://calcstatetax.com/api/news/?site=${apiSite}`;

  const res = await fetch(API_URL, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    console.error("News API failed:", API_URL, res.status);
    return new Response("Failed to generate sitemap-news", { status: 500 });
  }

  const data = await res.json();
  const articles = data.articles || [];

  const entries = articles
    .filter((a) => a.slug)
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
