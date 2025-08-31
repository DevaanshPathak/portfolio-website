"use client"

import dynamic from "next/dynamic"
import ThreeToggle, { useThreePreference } from "./three-toggle"
import HeroFallback from "./hero-fallback"

const Hero3D = dynamic(() => import("./hero-3d").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => <HeroFallback />,
})

export function HeroSection() {
  const { enabled } = useThreePreference()
  return (
    <div className="relative">
      {/* Top-right control */}
      <div className="pointer-events-none absolute right-4 top-16 z-50 flex gap-2">
        <div className="pointer-events-auto">
          <ThreeToggle />
        </div>
      </div>

      {enabled ? <Hero3D /> : <HeroFallback />}
    </div>
  )
}

export default HeroSection
