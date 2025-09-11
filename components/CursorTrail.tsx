"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "next-themes"

const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: fine)").matches
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches

export default function CursorTrail() {
  const { resolvedTheme } = useTheme()
  const color = resolvedTheme === "dark" ? "#22d3ee" : "#06b6d4" // cyan
  const dotColor = resolvedTheme === "dark" ? "#67e8f9" : "#22d3ee"

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const dprRef = useRef<number>(1)
  const [enabled, setEnabled] = useState(false)

  const state = useRef({
    points: [] as { x: number; y: number; t: number }[],
    mouseX: 0,
    mouseY: 0,
    visible: false,
  })

  // initialize on mount
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) {
      setEnabled(false)
      return
    }
    setEnabled(true)
  }, [])

  // helpers
  const resizeCanvas = () => {
    const c = canvasRef.current
    if (!c) return
    const { innerWidth: w, innerHeight: h, devicePixelRatio: dpr = 1 } = window
    dprRef.current = Math.min(2, dpr)
    c.width = Math.floor(w * dprRef.current)
    c.height = Math.floor(h * dprRef.current)
    c.style.width = w + "px"
    c.style.height = h + "px"
  }

  // animation loop
  useEffect(() => {
    if (!enabled) return

    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext("2d")!
    resizeCanvas()

    const MAX_AGE = 2800 // ms

    const draw = () => {
      const now = performance.now()
      const dpr = dprRef.current

      ctx.clearRect(0, 0, c.width, c.height)
      ctx.globalCompositeOperation = "lighter"

      // draw trails
      const pts = state.current.points
      // remove old
      let i = 0
      while (i < pts.length && now - pts[i].t > MAX_AGE) i++
      if (i > 0) pts.splice(0, i)

      for (let j = 0; j < pts.length; j++) {
        const p = pts[j]
        const age = (now - p.t) / MAX_AGE // 0..1
        const alpha = Math.max(0, 1 - age)
        const r = 14 + 30 * (1 - age)
        const x = p.x * dpr
        const y = p.y * dpr

        const grad = ctx.createRadialGradient(x, y, 0, x, y, r * dpr)
        grad.addColorStop(0, hexWithAlpha(color, alpha * 0.9))
        grad.addColorStop(0.4, hexWithAlpha(color, alpha * 0.5))
        grad.addColorStop(1, hexWithAlpha(color, 0))

        ctx.fillStyle = grad
        ctx.shadowColor = color
        ctx.shadowBlur = 24 * dpr * alpha
        ctx.beginPath()
        ctx.arc(x, y, r * dpr, 0, Math.PI * 2)
        ctx.fill()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, color])

  // events
  useEffect(() => {
    if (!enabled) return

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      const x = e.clientX
      const y = e.clientY
      state.current.mouseX = x
      state.current.mouseY = y
      state.current.visible = true
      state.current.points.push({ x, y, t: performance.now() })
      if (state.current.points.length > 1200) state.current.points.splice(0, state.current.points.length - 1200)
      positionDot(x, y)
    }
    const onLeave = () => {
      state.current.visible = false
      hideDot()
    }
    const onResize = () => resizeCanvas()

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    window.addEventListener("resize", onResize)

    // hide native cursor
    const prevCursor = document.body.style.cursor
    document.body.style.cursor = "none"

    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("resize", onResize)
      document.body.style.cursor = prevCursor
    }
  }, [enabled])

  // neon dot element management
  const dotRef = useRef<HTMLDivElement | null>(null)
  const positionDot = (x: number, y: number) => {
    const el = dotRef.current
    if (!el) return
    el.style.transform = `translate3d(${x - 6}px, ${y - 6}px, 0)`
    el.style.opacity = "1"
  }
  const hideDot = () => {
    const el = dotRef.current
    if (!el) return
    el.style.opacity = "0"
  }

  if (!enabled) return null

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[60]"
        aria-hidden
      />
      <div
        ref={dotRef}
        aria-hidden
        className="fixed z-[61] pointer-events-none"
        style={{
          width: 12,
          height: 12,
          borderRadius: 9999,
          background: dotColor,
          boxShadow: `0 0 10px ${dotColor}, 0 0 20px ${dotColor}, 0 0 40px ${color}`,
          filter: "saturate(1.2)",
          transition: "opacity 180ms ease-out, transform 40ms linear",
          opacity: 0,
          left: 0,
          top: 0,
        }}
      />
    </>
  )
}

function hexWithAlpha(hex: string, alpha: number) {
  const a = Math.max(0, Math.min(1, alpha))
  const n = Math.round(a * 255)
  const h = n.toString(16).padStart(2, "0")
  // normalize 3/6 digit hex to 6
  const norm = hex.replace("#", "")
  const six = norm.length === 3 ? norm.split("").map((c) => c + c).join("") : norm
  return `#${six}${h}`
}
