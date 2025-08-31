import Image from "next/image"
import { siteConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { SocialIcons } from "@/components/social-icons"

export function Hero() {
  return (
    <header className="py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <div className="flex items-start gap-6">
          <Image
            src="/diverse-profile-avatars.png"
            alt="Profile avatar"
            width={96}
            height={96}
            className="rounded-lg border border-border"
            priority
          />
          <div className="flex-1">
            <h1 className="text-pretty text-3xl font-semibold leading-tight md:text-4xl">{siteConfig.name}</h1>
            <p className="mt-1 text-primary font-medium">{siteConfig.role}</p>
            <p className="mt-3 text-muted-foreground leading-relaxed">{siteConfig.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button asChild>
                <a href={siteConfig.links.github} target="_blank" rel="noreferrer">
                  View GitHub
                </a>
              </Button>
              <Button variant="secondary" asChild>
                <a href={siteConfig.links.resume}>Download Resume</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={siteConfig.links.email}>Contact Me</a>
              </Button>
              <SocialIcons />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
