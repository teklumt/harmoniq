"use client"

import { Button } from "@/components/ui/button"
import { useQueue } from "@/contexts/queue-context"
import { SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, Repeat1, Volume2, VolumeX } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface QueueControlsProps {
  className?: string
  showVolumeControl?: boolean
}

export function QueueControls({ className, showVolumeControl = true }: QueueControlsProps) {
  const { state, controls, currentTrack } = useQueue()

  const getRepeatIcon = () => {
    switch (state.repeatMode) {
      case "one":
        return <Repeat1 className="h-4 w-4" />
      case "all":
        return <Repeat className="h-4 w-4" />
      default:
        return <Repeat className="h-4 w-4" />
    }
  }

  const getRepeatTooltip = () => {
    switch (state.repeatMode) {
      case "one":
        return "Repeat: One"
      case "all":
        return "Repeat: All"
      default:
        return "Repeat: Off"
    }
  }

  const handleVolumeChange = (value: number[]) => {
    controls.setVolume(value[0])
  }

  const toggleMute = () => {
    controls.setVolume(state.volume === 0 ? 1 : 0)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Shuffle */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={controls.toggleShuffle}
              className={state.isShuffled ? "text-primary" : "text-muted-foreground"}
              disabled={state.items.length === 0}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Shuffle: {state.isShuffled ? "On" : "Off"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Previous */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={controls.previous} disabled={state.items.length === 0}>
              <SkipBack className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Previous track</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Play/Pause */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="default"
              size="sm"
              onClick={state.isPlaying ? controls.pause : controls.play}
              disabled={!currentTrack}
              className="w-8 h-8 rounded-full"
            >
              {state.isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{state.isPlaying ? "Pause" : "Play"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Next */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={controls.next} disabled={state.items.length === 0}>
              <SkipForward className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Next track</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Repeat */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={controls.toggleRepeat}
              className={state.repeatMode !== "none" ? "text-primary" : "text-muted-foreground"}
              disabled={state.items.length === 0}
            >
              {getRepeatIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getRepeatTooltip()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Volume Control */}
      {showVolumeControl && (
        <div className="flex items-center gap-2 ml-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={toggleMute}>
                  {state.volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{state.volume === 0 ? "Unmute" : "Mute"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="w-20">
            <Slider
              value={[state.volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.01}
              className="cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  )
}
