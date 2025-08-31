import { siteConfig, type EducationItem } from "@/lib/config"
import { GitBranch, GitCommit, Tag } from "lucide-react"

function shortHash(input: string) {
  let h = 0
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i)
    h |= 0
  }
  const hex = (h >>> 0).toString(16)
  return hex.slice(0, 7).padStart(7, "0")
}

function Timeline({ items }: { items: EducationItem[] }) {
  return (
    <div className="relative">
      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <GitBranch className="h-4 w-4" />
        <span>git log --oneline</span>
        <span className="rounded bg-muted px-1.5 py-0.5">(main)</span>
      </div>
      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
        {items.map((item, idx) => (
          <div key={`${item.institution}-${item.degree}-${item.start}-${idx}`} className="relative mb-6">
            <div className="absolute left-0 top-3 h-4 w-4 rounded-full bg-primary ring-2 ring-background" />
            <div className="rounded-md border p-4 bg-card/60">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <GitCommit className="h-3.5 w-3.5" />
                    <span className="truncate">{shortHash(`${item.institution}-${item.degree}-${item.start}`)}</span>
                  </div>
                  <h3 className="font-medium mt-1">
                    {item.degree} @ {item.institution}
                  </h3>
                  {item.description ? (
                    <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                  ) : null}
                  {Array.isArray(item.highlights) && item.highlights.length > 0 ? (
                    <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                      {item.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {item.status ? (
                      <span className="inline-flex items-center gap-1 text-xs rounded border px-2 py-0.5">
                        <Tag className="h-3.5 w-3.5" /> {item.status}
                      </span>
                    ) : null}
                    <span className="text-xs font-mono rounded bg-muted px-1.5 py-0.5">education</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs text-muted-foreground font-mono">
                    {item.start} — {item.end ? item.end : "Present"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Education() {
  const items = Array.isArray(siteConfig.education) ? siteConfig.education : []

  return (
    <section id="education" className="py-10 md:py-12 border-t">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-2xl font-semibold">Education</h2>

        {items.length > 0 ? (
          <div className="mt-4">
            <Timeline items={items} />
          </div>
        ) : (
          <div className="mt-4 rounded-lg border p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">Scaler School of Technology — Applicant</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Applying to Scaler School of Technology to deepen my computer science fundamentals and accelerate my
                  software engineering career.
                </p>
              </div>
              <span className="text-xs rounded border border-secondary text-secondary px-2 py-1">In Progress</span>
            </div>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Based in {siteConfig.location}. Open to internships and entry-level backend roles.</p>
        </div>
      </div>
    </section>
  )
}
