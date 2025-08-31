import type React from "react"
import type { Metadata } from "next"
import { Manrope, Roboto_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/lib/config"
import ClipboardPatch from "@/components/ClipboardPatch"

const geistSans = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-sans",
})

const geistMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClipboardPatch />

          {/* Site-wide programmer background */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10"
          >
            <div
              className="absolute inset-0 opacity-15 dark:opacity-20 [background:radial-gradient(circle_at_20%_20%,theme(colors.emerald.500/.15),transparent_30%),radial-gradient(circle_at_80%_30%,theme(colors.cyan.500/.12),transparent_30%),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] [background-size:40px_40px,40px_40px,100%_36px]"
            />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:100%_3px] mix-blend-overlay" />
          </div>

          <div className="fixed right-4 top-4 z-50">
            <ThemeToggle />
          </div>

          {/* JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Person",
                name: siteConfig.name,
                jobTitle: siteConfig.role,
                url: siteConfig?.seo?.url || siteConfig.links.github,
                sameAs: [siteConfig.links.github, siteConfig.links.linkedin].filter(Boolean),
                email: siteConfig.links.email?.replace("mailto:", ""),
                description: siteConfig.summary,
              }),
            }}
          />

          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
