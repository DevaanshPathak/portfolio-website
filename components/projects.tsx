import { siteConfig } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Repo = {
  id: number
  name: string
  description: string | null
  stargazers_count: number
  html_url: string
  language: string | null
  forks_count: number
}

async function getRepos(username: string): Promise<Repo[]> {
  const uname = (username ?? "").trim()
  if (!uname || uname === "your-github-username") {
    return []
  }

  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(uname)}/repos?per_page=6&sort=updated`, {
    headers: {
      "User-Agent": "scaler-portfolio",
      Accept: "application/vnd.github+json",
    },
    // Revalidate periodically to keep it fresh
    next: { revalidate: 60 },
  })

  if (!res.ok) {
    return []
  }
  const data = (await res.json()) as Repo[]
  return data.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6)
}

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">
          <a href={repo.html_url} target="_blank" rel="noreferrer" className="hover:underline text-primary">
            {repo.name}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p className="leading-relaxed">{repo.description || "No description provided."}</p>
        <div className="mt-3 flex items-center flex-wrap gap-4">
          {repo.language ? (
            <span className="rounded-md border border-border bg-muted text-foreground px-2 py-0.5 text-xs">
              {repo.language}
            </span>
          ) : null}
          <span aria-label="Stars">⭐ {repo.stargazers_count}</span>
          <span aria-label="Forks">🍴 {repo.forks_count}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export async function Projects() {
  const repos = await getRepos(siteConfig.githubUsername)
  const isConfigured = !!siteConfig.githubUsername && siteConfig.githubUsername !== "your-github-username"

  return (
    <section id="projects" className="py-10 md:py-12 border-t">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-pretty">Projects</h2>
          <p className="mt-1 text-muted-foreground">Recent open-source work from my GitHub.</p>
        </div>
        {repos.length === 0 ? (
          <div className="rounded-md border p-6 text-sm text-muted-foreground">
            {isConfigured
              ? "No public repositories found or the GitHub API rate-limited the request. Try again in a minute, or ensure you have public repos."
              : "Set your GitHub username in lib/config.ts to load your latest repositories."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((r) => (
              <RepoCard key={r.id} repo={r} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
