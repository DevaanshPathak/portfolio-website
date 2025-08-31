"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text as DreiText } from "@react-three/drei"
import * as THREE from "three"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { SocialIcons } from "@/components/social-icons"
import { siteConfig } from "@/lib/config"

function Particles({ count = 800, color = "#94a3b8" }: { count?: number; color?: string }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 6 + Math.random() * 8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)
      arr.set([x, y, z], i * 3)
    }
    return arr
  }, [count])

  const pointsRef = useRef<THREE.Points>(null!)
  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.03
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} sizeAttenuation color={color} transparent opacity={0.8} />
    </points>
  )
}

function CodeRain({ count = 120 }: { count?: number }) {
  const instRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const lengths = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = Math.random() * 8 + 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
      speeds[i] = Math.random() * 1.2 + 0.4
      lengths[i] = Math.random() * 1.2 + 0.4
    }
    return { positions, speeds, lengths }
  }, [count])

  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const color = isDark ? "#22d3ee" : "#0891b2"

  useFrame((_, delta) => {
    const { positions, speeds, lengths } = data
    for (let i = 0; i < count; i++) {
      let x = positions[i * 3 + 0]
      let y = positions[i * 3 + 1]
      let z = positions[i * 3 + 2]
      y -= speeds[i] * delta * 3
      if (y < -2) {
        y = Math.random() * 8 + 2
        x = (Math.random() - 0.5) * 10
        z = (Math.random() - 0.5) * 10
      }
      positions[i * 3 + 0] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      dummy.position.set(x, y, z)
      dummy.scale.set(0.06, lengths[i], 0.06)
      dummy.rotation.set(0, 0, 0)
      dummy.updateMatrix()
      instRef.current?.setMatrixAt(i, dummy.matrix)
    }
    if (instRef.current) instRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={instRef} args={[undefined as any, undefined as any, count]}>
      <boxGeometry args={[0.06, 0.8, 0.06]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </instancedMesh>
  )
}

type KeyDef = { label: string; w?: number }
type Row = KeyDef[]

const rows: Row[] = [
  [
    { label: "ESC", w: 1.2 },
    { label: "1" },
    { label: "2" },
    { label: "3" },
    { label: "4" },
    { label: "5" },
    { label: "6" },
    { label: "7" },
    { label: "8" },
    { label: "9" },
    { label: "0" },
    { label: "-" },
    { label: "=" },
    { label: "BACK", w: 2 },
  ],
  [
    { label: "TAB", w: 1.6 },
    { label: "Q" },
    { label: "W" },
    { label: "E" },
    { label: "R" },
    { label: "T" },
    { label: "Y" },
    { label: "U" },
    { label: "I" },
    { label: "O" },
    { label: "P" },
    { label: "[" },
    { label: "]" },
    { label: "\\", w: 1.2 },
  ],
  [
    { label: "CAPS", w: 1.8 },
    { label: "A" },
    { label: "S" },
    { label: "D" },
    { label: "F" },
    { label: "G" },
    { label: "H" },
    { label: "J" },
    { label: "K" },
    { label: "L" },
    { label: ";" },
    { label: "'" },
    { label: "ENTER", w: 2.2 },
  ],
  [
    { label: "SHIFT", w: 2.2 },
    { label: "Z" },
    { label: "X" },
    { label: "C" },
    { label: "V" },
    { label: "B" },
    { label: "N" },
    { label: "M" },
    { label: "," },
    { label: "." },
    { label: "/" },
    { label: "SHIFT", w: 2.2 },
  ],
  [
    { label: "CTRL", w: 1.4 },
    { label: "ALT", w: 1.4 },
    { label: "SPACE", w: 6 },
    { label: "ALT", w: 1.4 },
    { label: "CTRL", w: 1.4 },
  ],
]

function KeyCap({
  label,
  width = 1,
  position = [0, 0, 0],
  pressed = false,
  onPress,
  onRelease,
}: {
  label: string
  width?: number
  position?: [number, number, number]
  pressed?: boolean
  onPress: (label: string) => void
  onRelease: (label: string) => void
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useFrame((_, delta) => {
    if (!ref.current) return
    const targetY = pressed ? -0.08 : 0
    ref.current.position.y += (targetY - ref.current.position.y) * Math.min(1, delta * 10)
    const s = hovered ? 1.03 : 1.0
    ref.current.scale.x += (s - ref.current.scale.x) * Math.min(1, delta * 10)
    ref.current.scale.y += (s - ref.current.scale.y) * Math.min(1, delta * 10)
    ref.current.scale.z += (s - ref.current.scale.z) * Math.min(1, delta * 10)
  })

  const base = isDark ? "#0f172a" : "#e5e7eb"
  const top = isDark ? "#1f2937" : "#f3f4f6"
  const border = isDark ? "#334155" : "#cbd5e1"
  const accent = isDark ? "#06b6d4" : "#164e63"

  return (
    <group position={position}>
      <mesh
        ref={ref}
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onPointerDown={(e) => {
          e.stopPropagation()
          onPress(label)
        }}
        onPointerUp={(e) => {
          e.stopPropagation()
          onRelease(label)
        }}
      >
        <boxGeometry args={[width, 0.22, 1]} />
        <meshStandardMaterial
          color={top}
          roughness={0.6}
          metalness={0.15}
          emissive={pressed ? accent : hovered ? border : "#000000"}
          emissiveIntensity={pressed ? 0.5 : hovered ? 0.15 : 0}
        />
      </mesh>
      {/* bezel */}
      <mesh position={[0, -0.16, 0]} receiveShadow>
        <boxGeometry args={[width + 0.06, 0.08, 1.02]} />
        <meshStandardMaterial color={base} roughness={0.95} metalness={0.05} />
      </mesh>
      {/* label */}
      <DreiText
        position={[0, 0.16, 0]}
        font="/fonts/GeistMono-Regular.ttf"
        fontSize={0.22}
        color={isDark ? "#cbd5e1" : "#334155"}
        anchorX="center"
        anchorY="bottom"
      >
        {label}
      </DreiText>
    </group>
  )
}

function useTerminalTexture(text: string, opts?: { width?: number; height?: number; theme?: "light" | "dark" }) {
  const { resolvedTheme } = useTheme()
  const theme = opts?.theme ?? (resolvedTheme === "dark" ? "dark" : "light")
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)

  if (!canvasRef.current) {
    const c = document.createElement("canvas")
    c.width = opts?.width ?? 1024
    c.height = opts?.height ?? 512
    canvasRef.current = c
    const tex = new THREE.CanvasTexture(c)
    tex.anisotropy = 2
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    textureRef.current = tex
  }

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!
    // background
    ctx.fillStyle = theme === "dark" ? "#000000" : "#0a0a0a"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw text in terminal green
    ctx.fillStyle = "#22c55e"
    ctx.font = "28px monospace"
    ctx.textBaseline = "top"

    const pad = 24
    const maxWidth = canvas.width - pad * 2
    const lineHeight = 34

    const lines: string[] = []
    const paragraphs = text.split("\n")
    paragraphs.forEach((p, i) => {
      const words = p.split(" ")
      let curr = ""
      for (const w of words) {
        const test = curr.length ? curr + " " + w : w
        if (ctx.measureText(test).width > maxWidth) {
          if (curr) lines.push(curr)
          curr = w
        } else {
          curr = test
        }
      }
      lines.push(curr)
      if (i < paragraphs.length - 1) lines.push("") // blank for newline
    })

    // keep only last N lines to fit
    const maxLines = Math.floor((canvas.height - pad * 2) / lineHeight)
    const visible = lines.slice(-maxLines)

    visible.forEach((ln, idx) => {
      ctx.fillText(ln, pad, pad + idx * lineHeight)
    })

    // cursor
    const t = Date.now() / 500
    if (Math.floor(t) % 2 === 0) {
      const last = visible[visible.length - 1] ?? ""
      const cursorX = pad + ctx.measureText(last).width + 8
      const cursorY = pad + (visible.length - 1) * lineHeight
      ctx.fillRect(cursorX, cursorY, 14, 28)
    }

    if (textureRef.current) {
      textureRef.current.needsUpdate = true
    }
  }, [text, resolvedTheme])

  return textureRef.current!
}

function Monitor3D({ text }: { text: string }) {
  const tex = useTerminalTexture(text)
  const frameColor = "#111827"
  const bodyColor = "#0b1220"

  return (
    <group position={[0, 0.5, -1.2]} rotation={[-0.05, 0, 0]}>
      {/* screen frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.4, 2.8, 0.12]} />
        <meshStandardMaterial color={frameColor} roughness={0.8} metalness={0.2} />
      </mesh>
      {/* screen panel */}
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[4.0, 2.4]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* logo bar */}
      <mesh position={[0, -1.45, 0.065]}>
        <planeGeometry args={[3.9, 0.12]} />
        <meshStandardMaterial color={"#0f172a"} />
      </mesh>
      {/* stand */}
      <mesh position={[0, -1.9, 0]}>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color={bodyColor} roughness={0.95} metalness={0.05} />
      </mesh>
      <mesh position={[0, -2.25, 0]}>
        <boxGeometry args={[2.2, 0.2, 1.2]} />
        <meshStandardMaterial color={bodyColor} roughness={0.95} metalness={0.05} />
      </mesh>
    </group>
  )
}

function Keyboard3D({
  onAppend,
  onBackspace,
}: {
  onAppend: (s: string) => void
  onBackspace: () => void
}) {
  const [pressed, setPressed] = useState<Set<string>>(new Set())

  const press = (label: string) =>
    setPressed((prev) => {
      const next = new Set(prev)
      next.add(label.toUpperCase())
      return next
    })

  const release = (label: string) =>
    setPressed((prev) => {
      const next = new Set(prev)
      next.delete(label.toUpperCase())
      return next
    })

  const handleType = (label: string) => {
    const key = label.toUpperCase()
    if (key === "BACK") return onBackspace()
    if (key === "ENTER") return onAppend("\n")
    if (key === "TAB") return onAppend("  ")
    if (key === "SPACE") return onAppend(" ")
    if (key.length === 1) return onAppend(key) // letters, digits, symbols
    // ignore SHIFT/CTRL/ALT/META/CAPS etc.
  }

  useEffect(() => {
    const normalize = (e: KeyboardEvent) => {
      const k = e.key
      if (k === " ") return "SPACE"
      if (k === "Shift") return "SHIFT"
      if (k === "Control") return "CTRL"
      if (k === "Alt") return "ALT"
      if (k === "Meta") return "META"
      if (k === "Backspace") return "BACK"
      if (k === "Tab") return "TAB"
      if (k === "CapsLock") return "CAPS"
      if (k === "Enter") return "ENTER"
      return k.length === 1 ? k.toUpperCase() : k.toUpperCase()
    }
    const down = (e: KeyboardEvent) => {
      const key = normalize(e)
      if (!key || e.repeat) return
      press(key)
      handleType(key)
    }
    const up = (e: KeyboardEvent) => {
      const key = normalize(e)
      if (!key) return
      release(key)
    }
    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [])

  const keyData = useMemo(() => {
    const spacingZ = 1.2
    const spacingX = 0.16
    const rowsOut: { label: string; w: number; x: number; z: number }[] = []
    rows.forEach((row, rIdx) => {
      const totalW = row.reduce((acc, k) => acc + (k.w ?? 1), 0) + (row.length - 1) * spacingX
      let x = -totalW / 2
      row.forEach((k) => {
        const w = k.w ?? 1
        const center = x + w / 2
        rowsOut.push({ label: k.label, w, x: center, z: rIdx * spacingZ })
        x += w + spacingX
      })
    })
    return rowsOut
  }, [])

  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const baseColor = isDark ? "#0b1220" : "#e2e8f0"

  return (
    <group position={[0, -0.75, 0.5]} rotation={[0.32, 0, 0]} scale={0.45}>
      {/* base plate */}
      <mesh position={[0, -0.28, 2.4]} receiveShadow>
        <boxGeometry args={[14, 0.2, 7.4]} />
        <meshStandardMaterial color={baseColor} roughness={0.95} metalness={0.05} />
      </mesh>

      {/* keys */}
      {keyData.map((k) => (
        <KeyCap
          key={`${k.label}-${k.x}-${k.z}`}
          label={k.label}
          width={k.w}
          position={[k.x, 0, k.z]}
          pressed={pressed.has(k.label)}
          onPress={(label) => {
            press(label)
            handleType(label)
          }}
          onRelease={release}
        />
      ))}
    </group>
  )
}

export function Hero3D() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const m = window.matchMedia("(max-width: 768px)")
      const update = () => setIsMobile(m.matches)
      update()
      m.addEventListener("change", update)
      return () => m.removeEventListener("change", update)
    }
  }, [])
  const particleColor = isDark ? "#94a3b8" : "#64748b"
  const particleCount = isMobile ? 400 : 800
  const rainCount = isMobile ? 60 : 120

  // terminal input state
  const [typed, setTyped] = useState<string>("")
  const append = (s: string) =>
    setTyped((t) => {
      const next = (t + s).slice(-4000) // limit buffer
      return next
    })
  const backspace = () =>
    setTyped((t) => {
      if (!t.length) return t
      // remove last char (handle newline)
      return t.slice(0, -1)
    })

  return (
    <header className="relative w-full h-[100svh]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.2, 7.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 8, 6]} intensity={1.2} castShadow />
        <directionalLight position={[-6, -4, -5]} intensity={0.35} />
        <Suspense fallback={null}>
          <group>
            {/* monitor with terminal output */}
            <Monitor3D text={typed} />
            {/* shrunken interactive keyboard */}
            <Keyboard3D onAppend={append} onBackspace={backspace} />
            {/* ambient effects */}
            <Particles count={particleCount} color={particleColor} />
            <CodeRain count={rainCount} />
          </group>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.6}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI - Math.PI / 3.5}
          />
        </Suspense>
      </Canvas>

      {/* Always-on overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center px-4">
        <div className="pointer-events-auto max-w-sm md:max-w-md text-center md:text-left">
          <h1 className="text-pretty text-3xl md:text-5xl font-semibold leading-tight">{siteConfig.name}</h1>
          <p className="mt-2 text-primary font-medium">{siteConfig.role}</p>
          <p className="mt-3 text-muted-foreground leading-relaxed hidden md:block">{siteConfig.summary}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
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
            <div className="hidden md:block">
              <SocialIcons />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative overlay */}
      <div className="pointer-events-none absolute inset-0 bg-background/0 md:bg-background/0" />
    </header>
  )
}
