"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/config"

export default function HeroFallback() {
  return (
    <section className="relative w-full h-[100svh] overflow-hidden">
      {/* subtle background pattern */}
      <div aria-hidden className="absolute inset-0 bg-background" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_20%,theme(colors.primary.DEFAULT/.25),transparent_30%),radial-gradient(circle_at_80%_30%,theme(colors.emerald.500/.15),transparent_30%),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] [background-size:40px_40px,40px_40px,100%_40px]"
      />
      <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
        <p className="text-sm text-muted-foreground tracking-wide">{siteConfig.role}</p>
        <h1 className={cn("text-pretty text-4xl md:text-6xl font-semibold")}>{siteConfig.name}</h1>
        <p className="max-w-2xl text-pretty text-muted-foreground md:text-lg">{siteConfig.summary}</p>
        <div className="flex gap-3">
          <Link className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90" href="#projects">
            View Projects
          </Link>
          <a
            className="rounded-md border px-4 py-2 hover:bg-muted"
            href={siteConfig.links.resume}
            target="_blank"
            rel="noreferrer"
          >
            Download Resume
          </a>
        </div>
      </div>
    </section>
  )
}
