import { siteConfig } from "@/lib/config"

export default function sitemap() {
  const base = siteConfig?.seo?.url || "https://example.com"
  const routes = ["", "/#projects", "/#activity", "/#coursework"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))
  return routes
}
