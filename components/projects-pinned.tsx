import Link from "next/link"
import * as site from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PinnedEntry =
  | string
  | {
      url: string
      label?: string
      description?: string
    }

function parseRepoUrl(u: string) {
  try {
    const url = new URL(u)
    const m = url.href.match(/github\.com\/([^/]+)\/([^/#?]+)/i)
    if (!m) return null
    return { owner: m[1], repo: m[2] }
  } catch {
    return null
  }
}

async function fetchRepo(owner: string, repo: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    next: { revalidate: 3600 },
    headers: {
      "User-Agent": "scaler-portfolio",
      Accept: "application/vnd.github+json",
    },
  })
  if (!res.ok) return null
  return res.json()
}

export default async function ProjectsPinned() {
  const entries = ((site as any).siteConfig?.pinnedRepos || []) as PinnedEntry[]
  if (!Array.isArray(entries) || entries.length === 0) return null

  const repos = await Promise.all(
    entries.map(async (entry) => {
      const url = typeof entry === "string" ? entry : entry.url
      const meta = typeof entry === "string" ? {} : entry
      const parsed = parseRepoUrl(url)

      if (!parsed) {
        return {
          html_url: url,
          name: (meta as any)?.label || url.replace(/^https?:\/\//, ""),
          description: (meta as any)?.description || "Custom link",
          stargazers_count: undefined as number | undefined,
          language: undefined as string | undefined,
          topics: [] as string[],
        }
      }

      const data = await fetchRepo(parsed.owner, parsed.repo)
      return {
        html_url: data?.html_url || url,
        name: (meta as any)?.label || data?.name || `${parsed.owner}/${parsed.repo}`,
        description: (meta as any)?.description || data?.description || "",
        stargazers_count: data?.stargazers_count as number | undefined,
        language: data?.language as string | undefined,
        topics: (data?.topics as string[]) || [],
      }
    }),
  )

  return (
    <section id="projects" className="py-10 md:py-12 border-t">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-pretty">Featured Projects</h2>
          <p className="mt-1 text-muted-foreground">Hand-picked repositories and links.</p>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {repos.map((r, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">{r.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {r.description ? <p className="leading-relaxed">{r.description}</p> : null}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                  {r.language ? <span>{r.language}</span> : null}
                  {typeof r.stargazers_count === "number" ? <span>★ {r.stargazers_count}</span> : null}
                  {(r.topics || []).slice(0, 4).map((t) => (
                    <span key={t} className="rounded-md border px-2 py-0.5 text-xs">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="pt-2">
                  <Link
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    View on GitHub
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
