"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, Music } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-white/20">404</h1>
          <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
          <p className="text-white/70">The page you're looking for doesn't exist or has been moved.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>

          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Search Music
            </Link>
          </Button>

          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Link href="/library">
              <Music className="w-4 h-4 mr-2" />
              My Library
            </Link>
          </Button>
        </div>

        <div className="pt-4">
          <p className="text-sm text-white/50">Lost in the music? Let's get you back on track.</p>
        </div>
      </div>
    </div>
  )
}
