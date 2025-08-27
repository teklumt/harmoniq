"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, Play, Heart, MoreHorizontal, Shuffle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useMusicContext } from "@/components/music-context"

export default function PlaylistPage() {
  const params = useParams()
  const { playTrack } = useMusicContext()
  const playlistId = params.id as string

  // Mock playlist data
  const playlist = {
    id: playlistId,
    name: playlistId.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    description: "Your favorite tracks in one place",
    image: `/placeholder.svg?height=300&width=300&query=${playlistId} playlist cover`,
    creator: "You",
    followers: "1,234",
    duration: "2h 34m",
    trackCount: 42,
  }

  const tracks = [
    { id: "1", title: "Midnight Dreams", artist: "Synthwave Artist", duration: "3:24", album: "Neon Nights" },
    { id: "2", title: "Electric Pulse", artist: "Digital Dreams", duration: "4:01", album: "Cyber City" },
    { id: "3", title: "Neon Lights", artist: "Retro Wave", duration: "3:45", album: "Future Past" },
    { id: "4", title: "Digital Love", artist: "Synthwave Artist", duration: "4:12", album: "Electric Hearts" },
    { id: "5", title: "Chrome Dreams", artist: "Cyber Punk", duration: "3:58", album: "Metal Soul" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900/20 to-black pb-24">
      <div className="relative">
        <div className="absolute top-4 left-4 z-10">
          <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
            <Link href="/library">
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </Button>
        </div>

        <div className="h-80 bg-gradient-to-b from-blue-600 to-blue-900 flex items-end p-6">
          <div className="flex items-end gap-6">
            <img
              src={playlist.image || "/placeholder.svg"}
              alt={playlist.name}
              className="w-48 h-48 rounded-lg shadow-2xl"
            />
            <div className="text-white pb-4">
              <p className="text-sm font-medium mb-2">Playlist</p>
              <h1 className="text-6xl font-bold mb-4">{playlist.name}</h1>
              <p className="text-lg opacity-80 mb-2">{playlist.description}</p>
              <p className="text-sm opacity-60">
                Made by {playlist.creator} • {playlist.trackCount} songs, {playlist.duration}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8"
            onClick={() => playTrack(tracks[0])}
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
            <Download className="w-6 h-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <MoreHorizontal className="w-6 h-6" />
          </Button>
        </div>

        <div>
          <div className="grid grid-cols-12 gap-4 px-4 py-2 text-white/60 text-sm border-b border-white/10 mb-4">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Title</div>
            <div className="col-span-3">Album</div>
            <div className="col-span-2">Date added</div>
            <div className="col-span-1">Duration</div>
          </div>

          <div className="space-y-1">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                className="grid grid-cols-12 gap-4 p-3 rounded-lg hover:bg-white/5 cursor-pointer group"
                onClick={() => playTrack(track)}
              >
                <div className="col-span-1 flex items-center">
                  <span className="text-white/60 group-hover:hidden">{index + 1}</span>
                  <Play className="w-4 h-4 text-white hidden group-hover:block" />
                </div>
                <div className="col-span-5 flex items-center">
                  <div>
                    <p className="text-white font-medium">{track.title}</p>
                    <p className="text-white/60 text-sm">{track.artist}</p>
                  </div>
                </div>
                <div className="col-span-3 flex items-center">
                  <p className="text-white/60 text-sm">{track.album}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="text-white/60 text-sm">3 days ago</p>
                </div>
                <div className="col-span-1 flex items-center justify-between">
                  <span className="text-white/60 text-sm">{track.duration}</span>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4 text-white/60" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
