export const prerender = false;

export async function GET({ site }) {
  const base =
    site?.toString().replace(/\/$/, "") ||
    "https://www.germanyfinanz.news";

  return new Response(
    `User-agent: *
Allow: /

# Main sitemap index
Sitemap: ${base}/sitemap.xml

# Child sitemaps
Sitemap: ${base}/sitemap-pages.xml
Sitemap: ${base}/sitemap-news.xml

# Google News sitemap
Sitemap: ${base}/sitemap-google-news.xml
`,
    {
      headers: { "Content-Type": "text/plain" },
    }
  );
}
