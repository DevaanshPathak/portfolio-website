"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/config"

export default function HeroFallback() {
  return (
    <section className="relative w-full h-[100svh] overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-background" />
      <div className="relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-6">
        <div className="w-full rounded-lg border shadow-sm bg-card/60 backdrop-blur-[1px]">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <span className="size-2.5 rounded-full bg-red-500/80" />
            <span className="size-2.5 rounded-full bg-yellow-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs text-muted-foreground font-mono">/bin/portfolio — bash</span>
          </div>
          <div className="p-5 font-mono text-sm md:text-base">
            <p className="text-muted-foreground">$ whoami</p>
            <p className="mb-4">{siteConfig.name}</p>
            <p className="text-muted-foreground">$ echo $ROLE</p>
            <p className="mb-4">{siteConfig.role}</p>
            <p className="text-muted-foreground">$ cat summary.txt</p>
            <p className="mb-4 leading-relaxed text-foreground/90">{siteConfig.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link className="border px-3 py-1.5 rounded-md hover:bg-muted/70" href="#projects">
                ./view-projects
              </Link>
              <a
                className="border px-3 py-1.5 rounded-md hover:bg-muted/70"
                href={siteConfig.links.resume}
                target="_blank"
                rel="noreferrer"
              >
                curl -O resume.pdf
              </a>
              <a className="border px-3 py-1.5 rounded-md hover:bg-muted/70" href={siteConfig.links.github} target="_blank" rel="noreferrer">
                git remote -v
              </a>
            </div>
            <p className="mt-6 text-emerald-500">$ <span className="animate-pulse">▍</span></p>
          </div>
        </div>
      </div>
    </section>
  )
}
