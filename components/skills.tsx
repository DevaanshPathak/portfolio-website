const skills = ["Python", "FastAPI", "Django", "PostgreSQL", "Docker", "Git", "Linux", "PyTest", "REST APIs", "CI/CD"]

export function Skills() {
  return (
    <section id="skills" className="py-10 md:py-12 border-t">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-pretty">Skills</h2>
          <p className="mt-1 text-muted-foreground">Tools and technologies I use frequently.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="rounded-md border border-border bg-muted text-foreground px-3 py-1 text-sm">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
