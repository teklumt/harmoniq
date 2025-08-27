"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MiniPlayer } from "@/components/mini-player"
import { BottomNav } from "@/components/bottom-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Play, Heart, MoreHorizontal, Search } from "lucide-react"
import { useMusic } from "@/components/music-context"

export default function HomePage() {
  const { setCurrentTrack, setIsPlaying, toggleLike, likedTracks, setSearchQuery } = useMusic()
  const [searchInput, setSearchInput] = useState("")
  const router = useRouter()

  const featuredAlbums = [
    {
      id: "1",
      title: "Synthwave Dreams",
      artist: "Neon Nights",
      cover: "/synthwave-album-cover-purple-neon.png",
    },
    {
      id: "2",
      title: "Peaceful Sunset",
      artist: "Calm Waves",
      cover: "/peaceful-sunset-album-cover-orange-pink.png",
    },
    {
      id: "3",
      title: "Gym Energy",
      artist: "Power Beats",
      cover: "/energetic-neon-gym-workout-album-green-blue.png",
    },
  ]

  const recentTracks = [
    { id: "track1", title: "Electric Dreams", artist: "Synth Master", duration: "3:45" },
    { id: "track2", title: "Ocean Breeze", artist: "Calm Waves", duration: "4:12" },
    { id: "track3", title: "Power Up", artist: "Energy Boost", duration: "3:28" },
  ]

  const handlePlayAlbum = (album: (typeof featuredAlbums)[0]) => {
    const track = {
      id: album.id,
      title: album.title,
      artist: album.artist,
      duration: "3:45",
      cover: album.cover,
    }
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const handlePlayTrack = (track: (typeof recentTracks)[0]) => {
    setCurrentTrack({
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
    })
    setIsPlaying(true)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      setSearchQuery(searchInput)
      router.push(`/search?q=${encodeURIComponent(searchInput)}`)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header with theme toggle */}
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Harmoniq</h1>
        <ThemeToggle />
      </div>

      <div className="relative overflow-hidden bg-background text-foreground">
        <div className="absolute inset-0 bg-[url('/abstract-music-wave-graphics-purple.png')] opacity-20 bg-cover bg-center" />
        <div className="relative px-6 py-16 text-center">
          <h1 className="text-4xl font-bold mb-4 text-balance">Welcome to Harmoniq</h1>
          <p className="text-lg opacity-90 mb-8 text-pretty">
            Discover your next favorite song from millions of tracks
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for songs, artists, albums..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 rounded-full border-2 focus:border-primary"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="rounded-full bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      {/* Featured Albums */}
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Albums</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAlbums.map((album) => (
            <Card key={album.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={album.cover || "/placeholder.svg?height=300&width=300&query=album cover"}
                    alt={album.title}
                    className="w-full aspect-square object-cover rounded-t-lg"
                  />
                  <Button
                    size="icon"
                    onClick={() => handlePlayAlbum(album)}
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-balance">{album.title}</h3>
                  <p className="text-muted-foreground">{album.artist}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recently Played */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-6">Recently Played</h2>
        <div className="space-y-3">
          {recentTracks.map((track) => (
            <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePlayTrack(track)}
                className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Play className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <h4 className="font-medium">{track.title}</h4>
                <p className="text-sm text-muted-foreground">{track.artist}</p>
              </div>
              <span className="text-sm text-muted-foreground">{track.duration}</span>
              <Button variant="ghost" size="icon" onClick={() => toggleLike(track.id)}>
                <Heart className={`h-4 w-4 ${likedTracks.has(track.id) ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <MiniPlayer />
      <BottomNav />
    </div>
  )
}
