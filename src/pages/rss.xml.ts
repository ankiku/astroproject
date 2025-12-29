export const prerender = false;

/* ✅ Base URL for RSS output (multi-domain safe) */
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

  // Local dev → mapped to known backend site
  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return "https://www.germanyfinanz.news";
  }

  return `https://${host}`;
}

/* ✅ Empty RSS feed (SAFE fallback) */
function emptyRSS(base: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Latest News</title>
  <link>${base}</link>
  <description>Latest news updates</description>
  <language>en</language>
</channel>
</rss>`;
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
    console.error("RSS API error:", err);
  }

  /* No articles → return empty RSS (NOT error) */
  if (!articles.length) {
    return new Response(emptyRSS(base), {
      headers: { "Content-Type": "application/rss+xml" },
    });
  }

  /* Limit feed size (best practice) */
  const items = articles
    .filter((a) => a.slug && a.title)
    .slice(0, 30)
    .map((article) => {
      const pubDate = article.created_at
        ? new Date(article.created_at).toUTCString()
        : new Date().toUTCString();

      const url = `${base}/${article.slug}`;

      return `
  <item>
    <title><![CDATA[${article.title}]]></title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${pubDate}</pubDate>
    ${article.description
          ? `<description><![CDATA[${article.description}]]></description>`
          : ""
        }
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
  <language>en</language>
${items}
</channel>
</rss>`,
    {
      headers: { "Content-Type": "application/rss+xml" },
    }
  );
}
