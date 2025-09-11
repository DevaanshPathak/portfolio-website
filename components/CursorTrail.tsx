"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: fine)").matches
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches

export default function CursorTrail() {
  const { resolvedTheme } = useTheme()
  const mainColor = resolvedTheme === "dark" ? "#67e8f9" : "#22d3ee"
  const trailColor = resolvedTheme === "dark" ? "#22d3ee" : "#06b6d4"

  const [enabled, setEnabled] = useState(false)

  // DOM refs
  const mainRef = useRef<HTMLDivElement | null>(null)
  const followerRefs = useRef<HTMLDivElement[]>([])

  // positions state (main + 4 followers)
  const target = useRef({ x: 0, y: 0 })
  const points = useRef(
    Array.from({ length: 5 }, () => ({ x: typeof window !== "undefined" ? window.innerWidth / 2 : 0, y: typeof window !== "undefined" ? window.innerHeight / 2 : 0 }))
  )
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) {
      setEnabled(false)
      return
    }
    setEnabled(true)
  }, [])

  // Animation loop
  useEffect(() => {
    if (!enabled) return

    const step = () => {
      // easing factors: main fastest, followers progressively slower
      const ease = [0.35, 0.22, 0.18, 0.15, 0.12]

      // move main toward pointer, followers toward previous
      const p = points.current
      p[0].x += (target.current.x - p[0].x) * ease[0]
      p[0].y += (target.current.y - p[0].y) * ease[0]
      for (let i = 1; i < p.length; i++) {
        p[i].x += (p[i - 1].x - p[i].x) * ease[i]
        p[i].y += (p[i - 1].y - p[i].y) * ease[i]
      }

      // apply DOM transforms
      const m = mainRef.current
      if (m) m.style.transform = `translate3d(${Math.round(p[0].x - 8)}px, ${Math.round(p[0].y - 8)}px, 0)`
      for (let i = 0; i < followerRefs.current.length; i++) {
        const el = followerRefs.current[i]
        const pos = p[i + 1]
        if (el && pos) el.style.transform = `translate3d(${Math.round(pos.x - followerSizes[i] / 2)}px, ${Math.round(pos.y - followerSizes[i] / 2)}px, 0)`
      }

      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled])

  // Pointer events
  useEffect(() => {
    if (!enabled) return

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      target.current.x = e.clientX
      target.current.y = e.clientY
      show()
    }
    const onLeave = () => hide()

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", onLeave)

    const prevCursor = document.body.style.cursor
    document.body.style.cursor = "none"

    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", onLeave)
      document.body.style.cursor = prevCursor
    }
  }, [enabled])

  const show = () => {
    const m = mainRef.current
    if (m) m.style.opacity = "1"
    followerRefs.current.forEach((el) => (el.style.opacity = "1"))
  }
  const hide = () => {
    const m = mainRef.current
    if (m) m.style.opacity = "0"
    followerRefs.current.forEach((el) => (el.style.opacity = "0"))
  }

  if (!enabled) return null

  return (
    <>
      <div
        ref={mainRef}
        aria-hidden
        className="fixed z-[61] pointer-events-none"
        style={{
          width: 16, // bigger main cursor
          height: 16,
          borderRadius: 9999,
          background: mainColor,
          opacity: 0,
          left: 0,
          top: 0,
          transition: "opacity 160ms ease-out",
          boxShadow: `0 0 4px ${mainColor}`,
        }}
      />
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) followerRefs.current[i] = el
          }}
          aria-hidden
          className="fixed z-[60] pointer-events-none"
          style={{
            width: followerSizes[i],
            height: followerSizes[i],
            borderRadius: 9999,
            background: trailColor,
            opacity: followerOpacities[i],
            left: 0,
            top: 0,
            transition: "opacity 160ms ease-out",
          }}
        />
      ))}
    </>
  )
}

const followerSizes = [10, 8, 6, 4]
const followerOpacities = [0.5, 0.35, 0.25, 0.15]
