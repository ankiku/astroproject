export const prerender = false;

function getBaseURL(request: Request) {
  const host = request.headers.get("host");

  if (!host || host.includes("localhost") || host.includes("127.0.0.1")) {
    return "http://localhost:4321";
  }

  return `https://${host}`;
}

export async function GET({ request }) {
  const base = getBaseURL(request);
  const now = new Date().toISOString();

  const staticUrls = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms-and-conditions",
    "/disclaimer",
    "/contact-us",
    "/rss.xml",
  ];

  const entries = staticUrls
    .map(
      (path) => `
  <url>
    <loc>${base}${path}</loc>
    <lastmod>${now}</lastmod>
    <priority>${path === "" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
}
