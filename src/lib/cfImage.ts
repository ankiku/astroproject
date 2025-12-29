export function cfImage(
  src: string,
  options: {
    w?: number;
    h?: number;
    fit?: "cover" | "contain";
    quality?: number;
  } = {}
) {
  if (!src) return "";

  // 🚫 Do NOT use Cloudflare resizing on localhost / dev
  if (
    typeof window === "undefined" ||
    location.hostname === "localhost" ||
    location.hostname.startsWith("127.") ||
    location.hostname.endsWith(".local")
  ) {
    return src;
  }

  // 🚫 Must be absolute URL for Cloudflare
  if (!src.startsWith("http")) return src;

  const params = [
    options.w && `w=${options.w}`,
    options.h && `h=${options.h}`,
    `fit=${options.fit || "cover"}`,
    `quality=${options.quality || 80}`,
    "format=auto"
  ]
    .filter(Boolean)
    .join(",");

  return `/cdn-cgi/image/${params}/${src}`;
}
