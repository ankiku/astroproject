export const prerender = false; // SSR

function getBaseURL(request: Request) {
  const host = request.headers.get("host");

  // Local dev fallback ONLY
  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return "http://localhost:4321";
  }

  // Production: trust the incoming domain
  return `https://${host}`;
}

export async function GET({ request }) {
  const base = getBaseURL(request);
  const now = new Date().toISOString();

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>${base}/sitemap-pages.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>

  <sitemap>
    <loc>${base}/sitemap-posts.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>

</sitemapindex>`,
    {
      headers: { "Content-Type": "application/xml" },
    }
  );
}
