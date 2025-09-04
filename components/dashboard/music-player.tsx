"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card } from "@/components/ui/card"
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Repeat, Shuffle } from "lucide-react"
import { Music } from "lucide-react"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [progress, setProgress] = useState([30])
  const [isLiked, setIsLiked] = useState(false)

  // Mock current song data
  const currentSong = {
    title: "Sample Song",
    artist: "Demo Artist",
    album: "Demo Album",
    duration: "3:45",
    currentTime: "1:23",
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-t border-border p-3 md:p-4">
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
        {/* Song Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1 w-full md:w-auto">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-md flex items-center justify-center shrink-0">
            <Music className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate text-sm md:text-base">{currentSong.title}</p>
            <p className="text-xs md:text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsLiked(!isLiked)} className="shrink-0">
            <Heart className={isLiked ? "h-4 w-4 fill-accent text-accent" : "h-4 w-4"} />
          </Button>
        </div>

        {/* Player Controls - Mobile: Full width, Desktop: Center */}
        <div className="flex flex-col items-center gap-2 w-full md:flex-1 md:max-w-md order-3 md:order-2">
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              variant="default"
              size="sm"
              className="h-8 w-8 md:h-10 md:w-10 rounded-full"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 w-full">
            <span className="text-xs text-muted-foreground hidden md:block">{currentSong.currentTime}</span>
            <Slider value={progress} onValueChange={setProgress} max={100} step={1} className="flex-1" />
            <span className="text-xs text-muted-foreground hidden md:block">{currentSong.duration}</span>
          </div>

          {/* Mobile time display */}
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground md:hidden">
            <span>{currentSong.currentTime}</span>
            <span>{currentSong.duration}</span>
          </div>
        </div>

        {/* Volume Control - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-end order-2 md:order-3">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-20 lg:w-24" />
        </div>

        {/* Mobile additional controls */}
        <div className="flex items-center gap-2 md:hidden order-2 w-full justify-center">
          <Button variant="ghost" size="sm">
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Repeat className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
