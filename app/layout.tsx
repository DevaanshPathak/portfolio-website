import type React from "react"
import type { Metadata } from "next"
import { Manrope, Roboto_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { siteConfig } from "@/lib/config"

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
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
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
