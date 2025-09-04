"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { QueueItem as QueueItemType } from "@/lib/types/music"
import { Play, Pause, X, ChevronUp, ChevronDown, Music, Clock, Disc3 } from "lucide-react"
import { useQueue } from "@/contexts/queue-context"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface QueueItemProps {
  item: QueueItemType
  index: number
  isCurrentTrack: boolean
  onPlay: () => void
  onRemove: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
}

export function QueueItem({ item, index, isCurrentTrack, onPlay, onRemove, onMoveUp, onMoveDown }: QueueItemProps) {
  const { state } = useQueue()
  const { track, source } = item

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getSourceIcon = () => {
    switch (source.type) {
      case "album":
        return <Disc3 className="h-3 w-3" />
      case "playlist":
        return <Music className="h-3 w-3" />
      default:
        return <Music className="h-3 w-3" />
    }
  }

  const getSourceColor = () => {
    switch (source.type) {
      case "album":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "playlist":
        return "bg-green-500/10 text-green-600 border-green-200"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200"
    }
  }

  return (
    <div
      className={`group flex items-center gap-3 p-2 rounded-lg transition-colors ${
        isCurrentTrack ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
      }`}
    >
      {/* Track number / Play button */}
      <div className="flex items-center justify-center w-8 h-8">
        {isCurrentTrack && state.isPlaying ? (
          <div className="flex items-center justify-center w-6 h-6 bg-primary rounded text-primary-foreground">
            <Pause className="h-3 w-3" />
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onPlay}
          >
            <Play className="h-3 w-3" />
          </Button>
        )}
        <span
          className={`text-xs text-muted-foreground group-hover:opacity-0 transition-opacity ${
            isCurrentTrack ? "opacity-0" : ""
          }`}
        >
          {index + 1}
        </span>
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`text-sm font-medium truncate ${isCurrentTrack ? "text-primary" : ""}`}>{track.title}</h4>
          {track.isExplicit && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              E
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{track.artist}</span>
          {track.album && (
            <>
              <span>•</span>
              <span className="truncate">{track.album}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 mt-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getSourceColor()}`}>
                  {getSourceIcon()}
                  <span className="ml-1 capitalize">{source.type}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  From {source.type}: {source.name}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Duration */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{formatTime(track.duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onMoveUp && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-6 h-6 p-0" onClick={onMoveUp}>
                  <ChevronUp className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move up</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {onMoveDown && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="w-6 h-6 p-0" onClick={onMoveDown}>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Move down</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-destructive hover:text-destructive"
                onClick={onRemove}
              >
                <X className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove from queue</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
