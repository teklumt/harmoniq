"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, Heart, Music, User, Disc } from "lucide-react"

const mockResults = {
  tracks: [
    { id: 1, title: "Midnight Dreams", artist: "Luna Eclipse", genre: "Electronic", duration: "3:45" },
    { id: 2, title: "Ocean Waves", artist: "Coastal Sounds", genre: "Ambient", duration: "4:12" },
    { id: 3, title: "City Lights", artist: "Urban Melody", genre: "Pop", duration: "3:28" },
  ],
  artists: [
    { id: 1, name: "Luna Eclipse", genre: "Electronic", tracks: 12 },
    { id: 2, name: "Coastal Sounds", genre: "Ambient", tracks: 8 },
    { id: 3, name: "Urban Melody", genre: "Pop", tracks: 15 },
  ],
  albums: [
    { id: 1, title: "Night Sessions", artist: "Luna Eclipse", year: 2024, tracks: 10 },
    { id: 2, title: "Ocean Dreams", artist: "Coastal Sounds", year: 2023, tracks: 8 },
    { id: 3, title: "City Stories", artist: "Urban Melody", year: 2024, tracks: 12 },
  ],
}

export function SearchInterface() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    console.log("[v0] Searching for:", query)

    // Simulate search delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] Search completed for:", query)
    setHasSearched(true)
    setIsSearching(false)
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search Form */}
      <Card>
        <CardContent className="p-4 md:pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for songs, artists, or albums..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isSearching || !query.trim()} className="w-full sm:w-auto">
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <Tabs defaultValue="tracks" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="tracks" className="flex-1 sm:flex-none">
                Tracks
              </TabsTrigger>
              <TabsTrigger value="artists" className="flex-1 sm:flex-none">
                Artists
              </TabsTrigger>
              <TabsTrigger value="albums" className="flex-1 sm:flex-none">
                Albums
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="tracks" className="space-y-3 md:space-y-4">
            {mockResults.tracks.map((track) => (
              <Card key={track.id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <Music className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-semibold truncate text-sm md:text-base">{track.title}</h3>
                      <p className="text-muted-foreground truncate text-xs md:text-sm">{track.artist}</p>
                      <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">{track.genre}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 shrink-0">
                      <span className="text-xs md:text-sm text-muted-foreground hidden sm:block">{track.duration}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Play className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground sm:hidden">{track.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="artists" className="space-y-3 md:space-y-4">
            {mockResults.artists.map((artist) => (
              <Card key={artist.id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-semibold truncate text-sm md:text-base">{artist.name}</h3>
                      <p className="text-muted-foreground text-xs md:text-sm">{artist.genre}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{artist.tracks} tracks</p>
                    </div>
                    <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="albums" className="space-y-3 md:space-y-4">
            {mockResults.albums.map((album) => (
              <Card key={album.id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <Disc className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-semibold truncate text-sm md:text-base">{album.title}</h3>
                      <p className="text-muted-foreground truncate text-xs md:text-sm">{album.artist}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {album.year} • {album.tracks} tracks
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
