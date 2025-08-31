import { siteConfig } from "@/lib/config"

export function CourseworkAchievements() {
  const coursework = siteConfig.coursework || []
  const achievements = siteConfig.achievements || []
  if (coursework.length === 0 && achievements.length === 0) return null

  return (
    <section id="coursework" className="mx-auto mt-12 max-w-5xl px-6">
      <div className="flex flex-col gap-8 md:flex-row">
        {coursework.length > 0 && (
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">Coursework</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {coursework.map((c, i) => (
                <li key={i} className="rounded-md border p-4">
                  <div className="font-medium">{c.title}</div>
                  {c.institution && <div className="text-sm text-muted-foreground">{c.institution}</div>}
                  {c.details && <p className="mt-2 text-sm text-muted-foreground">{c.details}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
        {achievements.length > 0 && (
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">Achievements</h2>
            <ul className="mt-4 grid grid-cols-1 gap-3">
              {achievements.map((a, i) => (
                <li key={i} className="rounded-md border p-4">
                  <div className="font-medium">{a.title}</div>
                  {a.event && <div className="text-sm text-muted-foreground">{a.event}</div>}
                  {a.date && <div className="text-xs text-muted-foreground">{a.date}</div>}
                  {a.details && <p className="mt-2 text-sm text-muted-foreground">{a.details}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default CourseworkAchievements
