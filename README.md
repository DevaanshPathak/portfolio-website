# Student Portfolio (Python Developer) — Documentation

A personal portfolio optimized for applications (e.g., Scaler School of Technology), featuring:
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
  - Set name, role, summary, and links.
  - Add pinnedRepos with your GitHub repo URLs to show “Featured Projects.”
  - Set githubUsername to enable the automatic Projects fallback.
  - Add coursework and achievements entries if you want those sections populated.
  - Certificates are optional; leave empty to hide the grid and show guidance.

- public/resume.pdf
  - Place your resume at /public/resume.pdf and ensure siteConfig.links.resume points to it.

## Deploying to Vercel

Option A — Deploy from this v0 project:
- Click Publish in the top-right (in v0). It will deploy to Vercel automatically.

Option B — GitHub + Vercel dashboard:
- Push your code to a GitHub repository.
- In Vercel, click “New Project” → Import your repo.
- Settings:
  - Framework: Next.js
  - Build Command: next build (default)
  - Output Directory: .next (default)
  - Node version: 20.x (Project Settings → General → Node.js Version)
- Environment Variables (optional):
  - GITHUB_TOKEN: If you have rate limits fetching repo metadata, add a Personal Access Token (classic with public_repo scope is enough). Not required, but reduces API throttling.
- Click Deploy.

After deploy:
- Verify the homepage shows the 3D hero (toggle “3D” ON if you turned it off before).
- Check the Featured Projects and Activity Snapshot render (watch for API rate limits).

## Production 3D Hero Checklist (if it doesn’t render)

- Dynamic import:
  - In components/hero-section.tsx, ensure Hero3D is loaded via:
    - dynamic(() => import("./hero-3d"), { ssr: false, loading: () => <HeroFallback /> })
- Client-only logic:
  - components/hero-3d.tsx should be a Client Component ("use client") and avoid window/document at module scope.
- Mounted guard:
  - HeroSection should decide between 3D vs fallback after client mount to avoid SSR hydration mismatch.
- Preference + reduced motion:
  - The 3D toggle should default ON unless the user prefers reduced motion or previously turned it off (stored in localStorage).
- Layout:
  - The hero wrapper should be relative w-full h-screen. The Canvas should be absolute inset-0, with the HTML overlay at a higher z-index above it.

## Troubleshooting (Local)

- Install conflicts or peer dependency errors:
  - Ensure Node 20 and npm 10+.
  - Do a clean install: delete node_modules and package-lock.json, then npm install.
  - Confirm package.json uses:
    - next ^15, react ^19, react-dom ^19
    - @react-three/fiber ^9, @react-three/drei ^9, three ^0.169
    - tailwindcss ^4, next-themes ^0.3, swr ^2

- GitHub API rate limits:
  - Add GITHUB_TOKEN in a .env.local for local dev and in Vercel Project Settings for production.
  - The site gracefully falls back to messaging when rate-limited.

- 3D hero performance:
  - Use the 3D toggle to disable heavy effects on low-end devices.
  - The hero respects prefers-reduced-motion automatically.

## Version Snapshot (package.json)

- Next: ^15.0.0
- React: ^19.0.0 (react, react-dom)
- @react-three/fiber: ^9.0.0
- @react-three/drei: ^9.113.0
- three: ^0.169.0
- tailwindcss: ^4.1.9
- next-themes: ^0.3.0
- swr: ^2.3.0

These are mutually compatible for a modern setup (local and Vercel).

## Notes About Toggles and Layout

- Theme toggle (light/dark) lives in layout and is fixed in the top-right.
- 3D toggle (enable/disable 3D hero) is positioned inside the hero (absolute top-16 right-4 by default) to avoid overlap with the theme toggle. Adjust in components/hero-section.tsx if you want them side-by-side.

## Requirements

- Node.js 20 LTS recommended (>= 18.18.0 works; 20.x is ideal for Next 15)
- npm 10+ (or pnpm/yarn if you prefer)
- A GitHub account if you plan to fetch repo metadata (optional GITHUB_TOKEN for higher rate limits)

## Quick Start (Local)

1) Clean install (important if you previously had conflicts)
- macOS/Linux:
  - rm -rf node_modules package-lock.json
  - npm install
- Windows PowerShell:
  - Remove-Item -Recurse -Force node_modules; Remove-Item package-lock.json
  - npm install

2) Run the dev server
- npm run dev
- Open http://localhost:3000

3) Build and start (production mode)
- npm run build
- npm start

4) Lint (optional)
- npm run lint
