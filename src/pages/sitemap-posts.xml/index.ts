export const prerender = false;

/* Base URL for sitemap output */
function getBaseURL(request: Request) {
  const host = request.headers.get("host");

  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return "http://localhost:4321";
  }

  return `https://${host}`;
}

/* Site key for Django API */
function getApiSite(request: Request) {
  const host = request.headers.get("host");

  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return "https://www.germanyfinanz.news";
  }

  return `https://${host}`;
}

/* Empty sitemap XML (SAFE fallback) */
function emptySitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
}

export async function GET({ request }) {
  const base = getBaseURL(request);
  const apiSite = getApiSite(request);

  const API_URL = `https://calcstatetax.com/api/sitemap/?site=${apiSite}`;

  let articles: any[] = [];

  try {
    const res = await fetch(API_URL, {
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      articles = data.articles || [];
    }
  } catch (err) {
    console.error("News sitemap API error:", err);
  }

  /* No articles → return empty sitemap (NOT error) */
  if (!articles.length) {
    return new Response(emptySitemap(), {
      headers: { "Content-Type": "application/xml" },
    });
  }

  const entries = articles
    .filter((a) => a.slug)
    .map((article) => {
      const lastmod = article.published_date
        ? new Date(article.published_date).toISOString()
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
