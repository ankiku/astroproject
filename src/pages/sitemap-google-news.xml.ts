export const prerender = false;

/* ✅ Base URL for sitemap output */
function getBaseURL(request: Request) {
  const host = request.headers.get("host");

  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return "http://localhost:4321";
  }

  return `https://${host}`;
}

/* ✅ Site key for Django API */
function getApiSite(request: Request) {
  const host = request.headers.get("host");

  // Local dev → use known registered site
  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return "https://www.germanyfinanz.news";
  }

  return `https://${host}`;
}

/* ✅ Empty Google News sitemap (SAFE fallback) */
function emptyGoogleNewsSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>
</urlset>`;
}

export async function GET({ request }) {
  const base = getBaseURL(request);
  const apiSite = getApiSite(request);

  const API_URL = `https://calcstatetax.com/api/news/?site=${apiSite}`;

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
    console.error("Google News sitemap API error:", err);
  }

  /* ⏱ LAST 48 HOURS ONLY (GOOGLE NEWS RULE) */
  const now = new Date();
  const fortyEightHoursAgo = new Date(
    now.getTime() - 48 * 60 * 60 * 1000
  );

  const recentArticles = articles
    .filter((a) => a.created_at && a.slug && a.title)
    .filter(
      (a) => new Date(a.created_at) >= fortyEightHoursAgo
    )
    .slice(0, 1000);

  /* No recent articles → return EMPTY sitemap */
  if (!recentArticles.length) {
    return new Response(emptyGoogleNewsSitemap(), {
      headers: { "Content-Type": "application/xml" },
    });
  }

  const entries = recentArticles
    .map((article) => {
      const pubDate = new Date(article.created_at).toISOString();

      return `
  <url>
    <loc>${base}/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Germany Finanz News</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title><![CDATA[${article.title}]]></news:title>
    </news:news>
  </url>`;
    })
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
>
${entries}
</urlset>`,
    {
      headers: { "Content-Type": "application/xml" },
    }
  );
}
