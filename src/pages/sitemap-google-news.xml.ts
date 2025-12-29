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
    return new Response("Failed to generate Google News sitemap", {
      status: 500,
    });
  }

  const data = await res.json();
  const articles = data.articles || [];

  /* 🔧 TEST MODE: last 30 days */
  const now = new Date();
  const thirtyDaysAgo = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000
  );

  const entries = articles
    .filter((a) => a.created_at && a.slug && a.title)
    .filter((a) => new Date(a.created_at) >= thirtyDaysAgo)
    .slice(0, 1000)
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
    { headers: { "Content-Type": "application/xml" } }
  );
}
