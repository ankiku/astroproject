export const prerender = false; // SSR

export async function GET({ request, site }) {
  const base =
    site?.toString().replace(/\/$/, "") ||
    "https://www.germanyfinanz.news";

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
    <loc>${base}/sitemap-news.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>

</sitemapindex>`,
    {
      headers: { "Content-Type": "application/xml" },
    }
  );
}
