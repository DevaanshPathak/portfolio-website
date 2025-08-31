import { siteConfig } from "@/lib/config"

export default function robots() {
  const host = siteConfig?.seo?.url || "https://example.com"
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${host}/sitemap.xml`,
    host,
  }
}
