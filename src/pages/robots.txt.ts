export async function GET({ site }) {
  const isLocalhost =
    site?.toString().includes("localhost") ||
    site?.toString().includes("127.0.0.1");

  // 🚫 Block bots on localhost
  if (isLocalhost) {
    return new Response(
      `User-agent: *
Disallow: /`,
      {
        headers: {
          "Content-Type": "text/plain",
        },
      }
    );
  }

  // ✅ Allow bots on production
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml`,
    {
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
}
