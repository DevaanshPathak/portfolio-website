import { HeroSection } from "@/components/hero-section"
import ProjectsPinned from "@/components/projects-pinned"
import { Projects } from "@/components/projects"
import { Skills } from "@/components/skills"
import { Education } from "@/components/education"
import { Certificates } from "@/components/certificates"
import { Contact } from "@/components/contact"
import { ActivitySnapshot } from "@/components/activity-snapshot"
import { CourseworkAchievements } from "@/components/coursework-achievements"
import { siteConfig } from "@/lib/config"

export default function Page() {
  return (
    <main className="font-sans" suppressHydrationWarning>
      <HeroSection />
      {Array.isArray(siteConfig.pinnedRepos) && siteConfig.pinnedRepos.length > 0 ? <ProjectsPinned /> : <Projects />}
      <ActivitySnapshot />
      <CourseworkAchievements />
      <Skills />
      <Education />
      <Certificates />
      <Contact />
      <footer className="py-8 border-t">
        <div className="mx-auto max-w-5xl px-4 text-center text-sm text-muted-foreground">
          Built with Next.js + shadcn/ui. © {new Date().getFullYear()}
        </div>
      </footer>
    </main>
  )
}
