import { siteConfig } from "@/lib/config"

export function Education() {
  return (
    <section id="education" className="py-10 md:py-12 border-t">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-2xl font-semibold">Education</h2>
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

        <div className="mt-4 text-sm text-muted-foreground">
          <p>Based in {siteConfig.location}. Open to internships and entry-level backend roles.</p>
        </div>
      </div>
    </section>
  )
}
