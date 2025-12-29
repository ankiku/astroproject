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
    return new Response("Failed to generate Google News sitemap", {
      status: 500,
    });
  }

  const data = await res.json();
  const articles = data.articles || [];

  /* 🔧 TEST MODE: last 30 days (change to 48h for production) */
  const now = new Date();
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const entries = articles
    .filter((a) => a.created_at)
    .filter((a) => new Date(a.created_at) >= twoDaysAgo)
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
    {
      headers: { "Content-Type": "application/xml" },
    }
  );
}
