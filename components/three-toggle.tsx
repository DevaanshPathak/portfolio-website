"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "enable3d"

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(m.matches)
    const handler = () => setReduced(m.matches)
    m.addEventListener?.("change", handler)
    return () => m.removeEventListener?.("change", handler)
  }, [])
  return reduced
}

export function useThreePreference() {
  const reduced = usePrefersReducedMotion()
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) {
      const initial = !reduced // default: off if user prefers reduced motion
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      setEnabled(initial)
    } else {
      setEnabled(JSON.parse(raw))
    }
  }, [reduced])

  const toggle = () => {
    setEnabled((prev) => {
      const next = !prev
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }

  return { enabled, toggle }
}

export default function ThreeToggle() {
  const { enabled, toggle } = useThreePreference()
  if (enabled === null) return null
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
      aria-pressed={enabled}
      title={enabled ? "Disable 3D" : "Enable 3D"}
    >
      <span className="inline-block h-2 w-2 rounded-full" style={{ background: enabled ? "limegreen" : "gray" }} />
      {enabled ? "3D: On" : "3D: Off"}
    </button>
  )
}
