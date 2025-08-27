"use client"

import { useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { MiniPlayer } from "@/components/mini-player"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, Share, TrendingUp, Music2, Clock } from "lucide-react"
import { useMusic } from "@/components/music-context"

export default function ProfilePage() {
  const { likedTracks, setCurrentTrack, setIsPlaying } = useMusic()
  const [followedArtists, setFollowedArtists] = useState(new Set<string>())

  const stats = [
    { label: "Liked Songs", value: likedTracks.size.toString(), icon: Music2 },
    { label: "Hours Listened", value: "89", icon: Clock },
    { label: "Favorite Genre", value: "Synthwave", icon: TrendingUp },
  ]

  const topArtists = [
    { id: "artist1", name: "Synth Master", plays: "47 plays" },
    { id: "artist2", name: "Neon Nights", plays: "32 plays" },
    { id: "artist3", name: "Calm Waves", plays: "28 plays" },
  ]

  const handleFollowArtist = (artistId: string) => {
    const newFollowed = new Set(followedArtists)
    if (newFollowed.has(artistId)) {
      newFollowed.delete(artistId)
    } else {
      newFollowed.add(artistId)
    }
    setFollowedArtists(newFollowed)
  }

  const handleShareProfile = async () => {
    try {
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: "My Harmoniq Profile",
          text: "Check out my music taste on Harmoniq!",
          url: window.location.href,
        }

        // Check if the data can be shared
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData)
        } else {
          throw new Error("Cannot share this data")
        }
      } else {
        throw new Error("Web Share API not supported")
      }
    } catch (error) {
      console.log("[v0] Web Share failed, using fallback:", error)
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert("Profile link copied to clipboard!")
      } catch (clipboardError) {
        console.log("[v0] Clipboard fallback failed:", clipboardError)
        // Final fallback: show the URL in a prompt
        prompt("Copy this link to share your profile:", window.location.href)
      }
    }
  }

  const handlePlayArtist = (artist: any) => {
    const track = {
      id: artist.id,
      title: `${artist.name} Radio`,
      artist: artist.name,
      duration: "∞",
    }
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="px-6 py-8">
        <div className="text-center mb-8">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src="/diverse-user-avatars.png" />
            <AvatarFallback className="text-2xl">MU</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mb-2">Music User</h1>
          <p className="text-muted-foreground mb-4">Premium Member</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" size="sm" onClick={handleShareProfile}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon }, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-lg font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Top Artists</h2>
          <div className="space-y-3">
            {topArtists.map((artist) => (
              <div
                key={artist.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Avatar className="cursor-pointer" onClick={() => handlePlayArtist(artist)}>
                  <AvatarImage src={`/abstract-geometric-shapes.png?height=40&width=40&query=${artist.name} artist`} />
                  <AvatarFallback>
                    {artist.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{artist.name}</h4>
                  <p className="text-sm text-muted-foreground">{artist.plays}</p>
                </div>
                <Button
                  variant={followedArtists.has(artist.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFollowArtist(artist.id)}
                >
                  {followedArtists.has(artist.id) ? "Following" : "Follow"}
                </Button>
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
