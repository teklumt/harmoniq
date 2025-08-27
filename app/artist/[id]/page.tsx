"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, Play, Heart, MoreHorizontal, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useMusicContext } from "@/components/music-context"

export default function ArtistPage() {
  const params = useParams()
  const { playTrack } = useMusicContext()
  const artistId = params.id as string

  // Mock artist data - in a real app, this would come from an API
  const artist = {
    id: artistId,
    name: artistId.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    image: `/placeholder.svg?height=300&width=300&query=${artistId} artist photo`,
    followers: "1.2M",
    monthlyListeners: "5.8M",
    verified: true,
  }

  const topTracks = [
    { id: "1", title: "Midnight Dreams", duration: "3:24", plays: "12M" },
    { id: "2", title: "Neon Lights", duration: "4:01", plays: "8.5M" },
    { id: "3", title: "Electric Soul", duration: "3:45", plays: "6.2M" },
    { id: "4", title: "Digital Love", duration: "4:12", plays: "4.8M" },
    { id: "5", title: "Synthwave Nights", duration: "3:58", plays: "3.9M" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-black pb-24">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
            <Link href="/">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
        </div>

        <div className="h-80 bg-gradient-to-b from-purple-600 to-purple-900 flex items-end p-6">
          <div className="flex items-end gap-6">
            <img
              src={artist.image || "/placeholder.svg"}
              alt={artist.name}
              className="w-48 h-48 rounded-full shadow-2xl"
            />
            <div className="text-white pb-4">
              <p className="text-sm font-medium mb-2">{artist.verified && "✓ Verified Artist"}</p>
              <h1 className="text-6xl font-bold mb-4">{artist.name}</h1>
              <p className="text-lg opacity-80">{artist.monthlyListeners} monthly listeners</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8"
            onClick={() => playTrack(topTracks[0])}
          >
            <Play className="w-5 h-5 mr-2" />
            Play
          </Button>
          <Button variant="outline" size="lg" className="border-white/20 text-white bg-transparent">
            <Shuffle className="w-5 h-5 mr-2" />
            Shuffle
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <Heart className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Popular</h2>
          <div className="space-y-2">
            {topTracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer group"
                onClick={() => playTrack(track)}
              >
                <span className="text-white/60 w-4 text-center group-hover:hidden">{index + 1}</span>
                <Play className="w-4 h-4 text-white hidden group-hover:block" />
                <div className="flex-1">
                  <p className="text-white font-medium">{track.title}</p>
                  <p className="text-white/60 text-sm">{track.plays} plays</p>
                </div>
                <span className="text-white/60 text-sm">{track.duration}</span>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="w-4 h-4 text-white/60" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
