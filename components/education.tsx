import { siteConfig, type EducationItem } from "@/lib/config"

function Timeline({ items }: { items: EducationItem[] }) {
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-0 bottom-0 w-px bg-border" />
      {items.map((item, idx) => (
        <div key={`${item.institution}-${item.degree}-${item.start}-${idx}`} className="relative mb-6">
          <div className="absolute left-0 top-3 h-4 w-4 rounded-full bg-background border-2 border-primary" />
          <div className="rounded-md border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">
                  {item.institution} — {item.degree}
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
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs text-muted-foreground">
                  {item.start} — {item.end ? item.end : "Present"}
                </div>
                {item.status ? (
                  <span className="inline-block mt-1 text-xs rounded border border-secondary text-secondary px-2 py-1">
                    {item.status}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ))}
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
