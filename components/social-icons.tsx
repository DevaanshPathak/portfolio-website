"use client"

import { siteConfig } from "@/lib/config"
import { Github, Linkedin, Mail } from "lucide-react"

const iconClass = "h-5 w-5"

export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <a
        href={siteConfig.links.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="text-foreground/80 hover:text-foreground transition-colors"
      >
        <Github className={iconClass} />
      </a>
      <a
        href={siteConfig.links.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="text-foreground/80 hover:text-foreground transition-colors"
      >
        <Linkedin className={iconClass} />
      </a>
      <a
        href={siteConfig.links.email}
        aria-label="Email"
        className="text-foreground/80 hover:text-foreground transition-colors"
      >
        <Mail className={iconClass} />
      </a>
    </div>
  )
}
