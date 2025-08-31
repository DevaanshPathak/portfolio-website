import { siteConfig } from "@/lib/config"

type Event = {
  type: string
  repo?: { name: string }
  payload?: { commits?: { message: string }[] }
  created_at?: string
}

async function ActivitySnapshot() {
  const username = siteConfig.githubUsername?.trim()
  if (!username) return null

  const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/events/public`, {
    headers: {
      "User-Agent": "scaler-portfolio",
      Accept: "application/vnd.github+json",
    },
    next: { revalidate: 180 },
  })

  if (!res.ok) {
    return (
      <section id="activity" className="mx-auto mt-12 max-w-5xl px-6">
        <h2 className="text-2xl font-semibold">Recent Activity</h2>
        <p className="mt-2 text-muted-foreground">
          Unable to load GitHub activity now (status {res.status}). This may be due to rate limits. Try again later.
        </p>
      </section>
    )
  }

  const events: Event[] = await res.json()
  const pushes = events.filter((e) => e.type === "PushEvent").slice(0, 5)

  return (
    <section id="activity" className="mx-auto mt-12 max-w-5xl px-6">
      <h2 className="text-2xl font-semibold">Recent Activity</h2>
      {pushes.length === 0 ? (
        <p className="mt-2 text-muted-foreground">No recent push events found.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {pushes.map((e, i) => (
            <li key={i} className="rounded-md border p-3">
              <div className="text-sm text-muted-foreground">
                {e.created_at ? new Date(e.created_at).toLocaleString() : ""}
              </div>
              <div className="font-medium">{e.repo?.name}</div>
              <ul className="mt-1 list-disc pl-5 text-sm">
                {(e.payload?.commits || []).slice(0, 3).map((c, j) => (
                  <li key={j}>{c.message}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export { ActivitySnapshot }
export default ActivitySnapshot
