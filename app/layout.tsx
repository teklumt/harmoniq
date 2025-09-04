import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { QueueProvider } from "@/contexts/queue-context"
import { MiniPlayer } from "@/components/player/mini-player"
import "./globals.css"
import { Suspense } from "react"

const binancePlex = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-binance-plex",
})

export const metadata: Metadata = {
  title: "Harmoniq - Your Music Streaming Experience",
  description: "Discover, upload, and share music with Harmoniq - the modern music streaming platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${binancePlex.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <QueueProvider>
              <div className="min-h-screen flex flex-col">
                <main className="flex-1 pb-20">{children}</main>
                <div className="fixed bottom-0 left-0 right-0 z-50">
                  <MiniPlayer />
                </div>
              </div>
            </QueueProvider>
          </ThemeProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
