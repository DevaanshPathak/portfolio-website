import Image from "next/image"
import Link from "next/link"
import * as site from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Certificate = {
  title: string
  issuer: string
  date?: string
  credentialUrl?: string
  skills?: string[]
  image?: string
}

export function Certificates() {
  const items = ((site as any).siteConfig?.certificates || []) as Certificate[]

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <section id="certificates" className="py-10 md:py-12 border-t">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-pretty">Certificates</h2>
            <p className="mt-1 text-muted-foreground">
              Add entries to siteConfig.certificates in lib/config.ts. Credential links are optional.
            </p>
          </div>
          <div className="rounded-md border p-6 text-sm text-muted-foreground">
            No certificates yet. Populate siteConfig.certificates to display them here.
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="certificates" className="py-10 md:py-12 border-t">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-pretty">Certificates</h2>
          <p className="mt-1 text-muted-foreground">
            Online courses and certifications I’ve completed. Credential links are optional.
          </p>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((c, idx) => (
            <Card key={idx}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-pretty">{c.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  <span>{c.issuer}</span>
                  {c.date ? <span className="ml-2">• {c.date}</span> : null}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {c.image ? (
                  <div className="overflow-hidden rounded-md border">
                    <Image
                      src={c.image || "/placeholder.svg"}
                      alt={`${c.title} certificate`}
                      width={640}
                      height={360}
                      className="h-auto w-full"
                    />
                  </div>
                ) : null}
                {Array.isArray(c.skills) && c.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {c.skills.slice(0, 6).map((s) => (
                      <span key={s} className="rounded-md border px-2 py-0.5 text-xs text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}
                {c.credentialUrl ? (
                  <div className="pt-1">
                    <Link
                      href={c.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      View credential
                    </Link>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
