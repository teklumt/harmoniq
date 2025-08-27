"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { MiniPlayer } from "@/components/mini-player"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Download, Clock, Music, Play, MoreHorizontal } from "lucide-react"
import { useMusic } from "@/components/music-context"

export default function LibraryPage() {
  const { setCurrentTrack, setIsPlaying, likedTracks, toggleLike } = useMusic()
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null)

  const libraryItems = [
    {
      id: "liked",
      icon: Heart,
      label: "Liked Songs",
      count: `${likedTracks.size} songs`,
      color: "from-pink-500 to-red-500",
    },
    {
      id: "downloaded",
      icon: Download,
      label: "Downloaded",
      count: "12 albums",
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "recent",
      icon: Clock,
      label: "Recently Played",
      count: "25 songs",
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "playlists",
      icon: Music,
      label: "My Playlists",
      count: "8 playlists",
      color: "from-purple-500 to-indigo-500",
    },
  ]

  const playlists = [
    {
      id: "workout",
      name: "Workout Mix",
      songs: 23,
      cover: "/workout-playlist.png",
      tracks: [
        { id: "w1", title: "Power Surge", artist: "Energy Boost", duration: "3:45" },
        { id: "w2", title: "Beast Mode", artist: "Gym Warriors", duration: "4:12" },
        { id: "w3", title: "Adrenaline Rush", artist: "Fitness Beats", duration: "3:28" },
      ],
    },
    {
      id: "chill",
      name: "Chill Vibes",
      songs: 31,
      cover: "/chill-playlist.png",
      tracks: [
        { id: "c1", title: "Sunset Dreams", artist: "Calm Waves", duration: "4:30" },
        { id: "c2", title: "Ocean Breeze", artist: "Peaceful Mind", duration: "5:15" },
        { id: "c3", title: "Morning Coffee", artist: "Lazy Sunday", duration: "3:50" },
      ],
    },
    {
      id: "focus",
      name: "Focus Mode",
      songs: 18,
      cover: "/focus-playlist.png",
      tracks: [
        { id: "f1", title: "Deep Concentration", artist: "Study Beats", duration: "6:00" },
        { id: "f2", title: "Mental Clarity", artist: "Focus Flow", duration: "4:45" },
        { id: "f3", title: "Productivity Zone", artist: "Work Vibes", duration: "5:20" },
      ],
    },
  ]

  const mockSongs = {
    liked: [
      { id: "liked1", title: "Electric Dreams", artist: "Synth Master", duration: "3:45" },
      { id: "liked2", title: "Ocean Breeze", artist: "Calm Waves", duration: "4:12" },
    ],
    downloaded: [
      { id: "down1", title: "Neon Lights", artist: "City Sounds", duration: "3:30" },
      { id: "down2", title: "Digital Love", artist: "Retro Wave", duration: "4:05" },
    ],
    recent: [
      { id: "recent1", title: "Power Up", artist: "Energy Boost", duration: "3:28" },
      { id: "recent2", title: "Midnight Drive", artist: "Night Rider", duration: "4:15" },
    ],
  }

  const handleLibraryItemClick = (itemId: string) => {
    setSelectedSection(selectedSection === itemId ? null : itemId)
  }

  const handlePlaySong = (song: any) => {
    setCurrentTrack(song)
    setIsPlaying(true)
  }

  const handlePlayPlaylist = (playlist: any) => {
    const track = {
      id: playlist.id,
      title: playlist.name,
      artist: "Playlist",
      duration: "45:30",
    }
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylist(selectedPlaylist === playlistId ? null : playlistId)
  }

  const handleMoreOptions = (item: any) => {
    console.log("[v0] More options for:", item.title || item.name)
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Library</h1>

        {/* Quick Access */}
        <div className="grid grid-cols-1 gap-3 mb-8">
          {libraryItems.map(({ id, icon: Icon, label, count, color }) => (
            <div key={id}>
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleLibraryItemClick(id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={`/abstract-geometric-shapes.png?height=48&width=48&query=${label.toLowerCase()}`}
                      alt={label}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{label}</h3>
                      <p className="text-sm text-muted-foreground">{count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedSection === id && mockSongs[id as keyof typeof mockSongs] && (
                <div className="mt-3 space-y-2 pl-4">
                  {mockSongs[id as keyof typeof mockSongs].map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePlaySong(song)}
                        className="w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{song.title}</h4>
                        <p className="text-xs text-muted-foreground">{song.artist}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{song.duration}</span>
                      <Button variant="ghost" size="icon" onClick={() => toggleLike(song.id)}>
                        <Heart className={`h-3 w-3 ${likedTracks.has(song.id) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Made by You</h2>
          <div className="space-y-3">
            {playlists.map((playlist) => (
              <div key={playlist.id}>
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handlePlaylistClick(playlist.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={playlist.cover || "/placeholder.svg"}
                        alt={playlist.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{playlist.name}</h3>
                        <p className="text-sm text-muted-foreground">{playlist.songs} songs</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePlayPlaylist(playlist)
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {selectedPlaylist === playlist.id && (
                  <div className="mt-3 space-y-2 pl-4">
                    {playlist.tracks.map((track) => (
                      <div
                        key={track.id}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handlePlaySong(track)}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-10 h-10 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{track.title}</h4>
                          <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{track.duration}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleLike(track.id)
                          }}
                        >
                          <Heart
                            className={`h-3 w-3 ${likedTracks.has(track.id) ? "fill-red-500 text-red-500" : ""}`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMoreOptions(track)
                          }}
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <MiniPlayer />
      <BottomNav />
    </div>
  )
}
