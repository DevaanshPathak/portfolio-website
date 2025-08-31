"use client"

import dynamic from "next/dynamic"
import ThreeToggle, { useThreePreference } from "./three-toggle"
import HeroFallback from "./hero-fallback"
import { useEffect, useState } from "react"

const Hero3D = dynamic(() => import("./hero-3d").then((m) => m.Hero3D), {
  ssr: false,
  loading: () => <HeroFallback />,
})

export function HeroSection() {
  const { enabled } = useThreePreference()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="relative">
      {/* Top-right control */}
      <div className="pointer-events-none absolute right-4 top-16 z-50 flex gap-2">
        <div className="pointer-events-auto">
          <ThreeToggle />
        </div>
      </div>

      {/* Only decide after mount to avoid SSR mismatch; still shows a good fallback while mounting */}
      {mounted ? enabled ? <Hero3D /> : <HeroFallback /> : <HeroFallback />}
    </div>
  )
}

export default HeroSection
