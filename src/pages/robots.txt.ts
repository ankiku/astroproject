export const prerender = false;

export async function GET({ request }) {
  const url = new URL(request.url);
  const base = `${url.protocol}//${url.host}`;

  return new Response(
    `User-agent: *
    Allow: /

    # Main sitemap index
    Sitemap: ${base}/sitemap.xml

    # Child sitemaps
    Sitemap: ${base}/sitemap-pages.xml
    Sitemap: ${base}/sitemap-posts.xml

`,
    {
      headers: { "Content-Type": "text/plain" },
    }
  );
}
