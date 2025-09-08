import { siteConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"

export function Contact() {
  return (
    <section id="contact" className="py-12 md:py-16 border-t" suppressHydrationWarning>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-2xl font-semibold">Get in touch</h2>
        <p className="mt-2 text-muted-foreground">
          I’m happy to chat about backend roles, internships, or collaborations.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3">
          <Button asChild>
            <a href={siteConfig.links.email}>Email me</a>
          </Button>
          <Button variant="secondary" asChild>
            <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
