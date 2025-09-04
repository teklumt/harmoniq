"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useQueue } from "@/contexts/queue-context"
import { QueueItem } from "./queue-item"
import { Music, Shuffle, Repeat, Repeat1, ListMusic, Trash2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface QueuePanelProps {
  className?: string
}

export function QueuePanel({ className }: QueuePanelProps) {
  const { state, actions, controls } = useQueue()
  const [isExpanded, setIsExpanded] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getTotalDuration = () => {
    return state.items.reduce((total, item) => total + item.track.duration, 0)
  }

  const getRepeatIcon = () => {
    switch (state.repeatMode) {
      case "one":
        return <Repeat1 className="h-4 w-4" />
      case "all":
        return <Repeat className="h-4 w-4" />
      default:
        return <Repeat className="h-4 w-4 opacity-50" />
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListMusic className="h-5 w-5" />
            Queue
            {state.items.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {state.items.length}
              </Badge>
            )}
          </CardTitle>

          <div className="flex items-center gap-1">
            {/* Queue controls */}
            <Button
              variant="ghost"
              size="sm"
              onClick={controls.toggleShuffle}
              className={state.isShuffled ? "text-primary" : "text-muted-foreground"}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={controls.toggleRepeat}
              className={state.repeatMode !== "none" ? "text-primary" : "text-muted-foreground"}
            >
              {getRepeatIcon()}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
                  {isExpanded ? "Collapse" : "Expand"} Queue
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={actions.clearQueue}
                  className="text-destructive"
                  disabled={state.items.length === 0}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Queue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {state.items.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{state.items.length} tracks</span>
            <span>{formatTime(getTotalDuration())}</span>
            {state.isShuffled && (
              <Badge variant="outline" className="text-xs">
                Shuffled
              </Badge>
            )}
            {state.repeatMode !== "none" && (
              <Badge variant="outline" className="text-xs">
                Repeat {state.repeatMode}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {state.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Music className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tracks in queue</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Add some music to get started. You can add individual tracks, albums, or playlists.
            </p>
          </div>
        ) : (
          <ScrollArea className={isExpanded ? "h-96" : "h-64"}>
            <div className="px-4 pb-4">
              {state.items.map((item, index) => (
                <div key={item.id}>
                  <QueueItem
                    item={item}
                    index={index}
                    isCurrentTrack={index === state.currentIndex}
                    onPlay={() => actions.playFromIndex(index)}
                    onRemove={() => actions.removeItem(item.id)}
                    onMoveUp={index > 0 ? () => actions.moveItem(index, index - 1) : undefined}
                    onMoveDown={index < state.items.length - 1 ? () => actions.moveItem(index, index + 1) : undefined}
                  />
                  {index < state.items.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
