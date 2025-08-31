# Portfolio — Documentation

A personal portfolio featuring:
- A 3D, programmer-themed hero with an interactive keyboard and a live terminal on a 3D monitor
- Featured (pinned) GitHub repositories and/or auto-fetched repos
- Optional certificates section
- Light/dark theming with a toggle

This document explains what each file does and which code powers each section.

## Tech Stack
- Next.js App Router (React Server Components where possible)
- Tailwind CSS v4 + shadcn/ui base styles
- React Three Fiber + drei for 3D
- next-themes for light/dark mode
- TypeScript

## Page Composition
- app/page.tsx
  - Imports and renders the main sections in order:
    - <HeroSection /> — Wrapper that chooses between the 3D scene (Hero3D) and a static fallback based on user preference and reduced-motion.
    - Featured Projects or Projects (auto) — Conditional:
      - If siteConfig.pinnedRepos has links → <ProjectsPinned />
      - Else → <Projects /> (auto GitHub fetch)
    - <ActivitySnapshot />, <CourseworkAchievements />, <Skills />, <Education />, <Certificates />, <Contact />
  - Appends a simple footer.

## Layout, Providers, Theming
- app/layout.tsx
  - Loads fonts (Geist Sans/Mono + Manrope) and globals.css.
  - Wraps the app in <ThemeProvider /> (from components/theme-provider.tsx).
  - Places <ThemeToggle /> in the top-right (fixed) so users can switch light/dark modes.
  - Suspense boundary for streaming and @vercel/analytics injection.

- components/theme-provider.tsx
  - Thin wrapper around next-themes ThemeProvider. Controls theme attribute/class on the html root.

- components/theme-toggle.tsx
  - Client component that uses useTheme() from next-themes.
  - Handles initial mount to avoid hydration flashes.
  - Toggles theme between "light" and "dark". Uses lucide-react icons and shadcn/ui Button.

- app/globals.css
  - Tailwind v4 base + tokens: CSS custom properties for background, foreground, primary, secondary, border, ring, etc., with light and dark values.
  - @theme inline maps CSS variables into Tailwind design tokens.
  - Base layer applies semantic classes for body and sets heading font-family.

## Configuration (Your Details)
- lib/config.ts (siteConfig)
  - name, role, summary, location — used by the overlay in the hero and elsewhere.
  - githubUsername — used by <Projects /> auto-fetch (optional).
  - pinnedRepos — array of GitHub URLs (or objects) for “Featured Projects” via <ProjectsPinned />. Add more links to show more cards.
  - certificates — optional list of course/certificate entries. If empty, the Certificates section displays guidance (or can be hidden by leaving it empty).
  - links — GitHub, LinkedIn, email mailto link, resume path.

Update siteConfig to personalize all visible copy and links.

## 3D Hero — components/hero-3d.tsx
This file contains the full-screen 3D scene and the always-on HTML overlay.

- High-level component: export function Hero3D()
  - Renders a full-viewport <Canvas> (R3F) with:
    - Lights (ambient+directional)
    - Suspense boundary
    - The scene group:
      - <Monitor3D text={typed} /> — 3D monitor with a terminal screen driven by a texture
      - <Keyboard3D onAppend={append} onBackspace={backspace} /> — Interactive keyboard
      - Ambient effects: <Particles />, <NeonGrid />, <CodeRain />
    - <OrbitControls /> for gentle rotation (zoom/pan disabled)
  - Always-visible HTML overlay (outside Canvas) for:
    - Your name: siteConfig.name
    - Role: siteConfig.role
    - Summary: siteConfig.summary (hidden on small screens for readability)
    - CTAs (View GitHub, Download Resume, Contact Me) using siteConfig.links

- Input handling and state:
  - typed (string) — live text displayed on the 3D monitor terminal.
  - append(s) and backspace() — handlers bound to keyboard interactions:
    - Clicking 3D keys or pressing your physical keys updates typed text.
  - Responsive tweaks: mobile detection reduces particle/rain density.

- Keyboard internals:
  - rows (constant) — Key layout definition: each row is an array of { label, w? } where w sets the key width (e.g., SHIFT, ENTER, SPACE are wider).
  - <Keyboard3D />
    - Computes positions for each key in a grid (useMemo).
    - Renders each key via <KeyCap /> with:
      - boxGeometry for top and bezel
      - meshStandardMaterial with theme-aware colors and subtle emissive glow on hover/press
      - Pointer events: onPress/onRelease to animate and update text
    - Group transform controls keyboard placement/orientation:
      - position={[0, -0.75, 0.5]}
      - rotation={[...]} — X-tilt controls “laptop stand” angle (front edge slightly lower, top row slightly higher)
      - scale — overall size

  - <KeyCap />
    - Animates press depth and hover scale with useFrame.
    - Renders the key label with <DreiText> (font="/fonts/GeistMono-Regular.ttf").
    - Uses theme-aware colors for top/base/border/accent.

- Terminal monitor internals:
  - <Monitor3D />
    - Builds a simple monitor: frame, screen plane (with a map), stand, and base.
    - Receives text and passes it to useTerminalTexture to generate a live CanvasTexture.

  - useTerminalTexture(text)
    - Creates an offscreen HTMLCanvasElement and THREE.CanvasTexture.
    - Clears background, renders neon-green text in a monospace font with basic line wrapping.
    - Draws a blinking “cursor” rectangle at the end of the last line.
    - Updates texture on each text/theme change (texture.needsUpdate = true).

- Ambient effects:
  - <Particles />
    - Generates a spherical cloud of points from random positions and slowly rotates them.
    - count and color adapt to theme and mobile/desktop.

  - <NeonGrid />
    - Floor grid using drei’s <Grid> with theme-aware primary/secondary colors.
    - Positioned below the scene and rotated to lay flat.

  - <CodeRain />
    - Instanced falling “code streaks” (instancedMesh of thin boxes) with randomized speeds/lengths.
    - Constantly updates instance matrices in useFrame for performance.

- OrbitControls
  - Smooth, bounded rotation around the scene.
  - enableZoom={false}, enablePan={false}, with damping and polarAngle limits.

- HTML overlay (always visible)
  - Positioned absolutely over the Canvas (z-index above Canvas, pointer-events handled so buttons remain clickable).
  - Pulls text and links from siteConfig.

## Projects Sections
- components/projects-pinned.tsx (Featured Projects)
  - Reads siteConfig.pinnedRepos:
    - Each entry can be a URL string or an object { url, label?, description? }.
  - parseRepoUrl(url) — extracts { owner, repo } if the URL is a GitHub repo.
  - fetchRepo(owner, repo) — fetches repo metadata from GitHub (revalidate hourly).
  - For GitHub URLs: merges metadata (name, description, stars, language, topics) with optional overrides (label/description).
  - For non-GitHub links: renders a generic “Custom link” card using the provided URL.
  - Renders a responsive grid of <Card>s: title → GitHub link, description, language, stars, topics.

- components/projects.tsx (Auto Projects)
  - getRepos(username) — fetches a user’s repos from GitHub with basic headers and revalidate=60.
    - Sorts by stars and shows top 6.
  - Projects() — server component that:
    - Uses siteConfig.githubUsername; if missing or rate-limited, shows an informative empty state.
    - Otherwise, renders a responsive grid of RepoCard.

## Certificates Section
- components/certificates.tsx
  - Reads siteConfig.certificates (array). If empty/missing: shows a helpful message and how to add entries.
  - For each certificate:
    - Card header: title, issuer, optional date
    - Optional image (if provided)
    - Optional skills (rendered as small tags)
    - Optional credential URL (link is hidden if not provided)
  - Grid layout is responsive and accessible.

## Design Tokens and Typography
- Color system (3–5 core colors observed in globals.css):
  - Primary cyan-teal (brand), rose accent, and neutral slate/white variants.
  - Tokens defined for both light and dark modes (semantic variables).
- Fonts:
  - Manrope for body via --font-manrope mapped to Tailwind font-sans.
  - Geist Sans/Mono available for headings and code aesthetics.
- Layout:
  - Mobile-first with generous spacing and consistent max-widths (max-w-5xl containers).
  - Uses flex/grid utility classes and semantic sections/headings.

## Customization Guide
- Update lib/config.ts
  - name, role, summary, links
  - pinnedRepos: paste more GitHub repo URLs to automatically get more “Featured Projects” cards.
  - githubUsername: enable the auto “Projects” fallback.
  - certificates: add entries or leave empty to hide the main grid and show guidance.
- Resume
  - Place your PDF at /public/resume.pdf and ensure siteConfig.links.resume points to it.
- 3D Hero tweaks
  - Tilt: adjust Keyboard3D group rotation.x to taste.
  - Particle density: tune Particles count and CodeRain count (Hero3D sets fewer on mobile).
  - Terminal color: change fillStyle in useTerminalTexture if you prefer a different green or size.

## Troubleshooting
- GitHub repos not showing
  - For Featured Projects: ensure pinnedRepos contains valid GitHub URLs.
  - For auto Projects: set githubUsername; note unauthenticated GitHub API calls are rate-limited.
- Text disappeared over 3D
  - The overlay is outside the Canvas and should always be visible. Keep it out-of-scene to avoid occlusion.
- Performance on low-end devices
  - Reduce particle/code-rain counts; consider lowering Canvas dpr or disabling some effects on mobile.

### 3D Toggle and Reduced Motion
- components/three-toggle.tsx + components/hero-section.tsx
  - ThreeToggle persists the preference in localStorage ("enable3d") and respects prefers-reduced-motion (defaults to Off if the user prefers reduced motion).
  - HeroSection reads that preference and renders either the full 3D scene or a static HeroFallback.
  - Positioning: ThemeToggle is fixed at top-right in layout; to avoid overlap, ThreeToggle is positioned at top-16 in HeroSection (absolute right-4 top-16). Adjust these classes if you want a different placement.
