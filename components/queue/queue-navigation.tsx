"use client"

import { Button } from "@/components/ui/button"
import { useQueue } from "@/contexts/queue-context"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface QueueNavigationProps {
  className?: string
  onShowQueue?: () => void
}

export function QueueNavigation({ className, onShowQueue }: QueueNavigationProps) {
  const { state, actions, currentTrack } = useQueue()

  const canGoBack = state.currentIndex > 0
  const canGoForward = state.currentIndex < state.items.length - 1

  const handlePrevious = () => {
    if (canGoBack) {
      actions.playFromIndex(state.currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (canGoForward) {
      actions.playFromIndex(state.currentIndex + 1)
    }
  }

  const jumpToTrack = (index: number) => {
    actions.playFromIndex(index)
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Previous Track */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrevious}
        disabled={!canGoBack}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {/* Current Track Info */}
      {currentTrack && (
        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md min-w-0">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
          <div className="text-xs text-muted-foreground">
            {state.currentIndex + 1} / {state.items.length}
          </div>
        </div>
      )}

      {/* Next Track */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleNext}
        disabled={!canGoForward}
        className="flex items-center gap-1"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Queue Menu */}
      {state.items.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {onShowQueue && (
              <>
                <DropdownMenuItem onClick={onShowQueue}>Show Queue</DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Jump to Track</div>

            <div className="max-h-48 overflow-y-auto">
              {state.items.slice(0, 10).map((item, index) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => jumpToTrack(index)}
                  className={index === state.currentIndex ? "bg-accent" : ""}
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xs text-muted-foreground w-6">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm truncate">{item.track.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.track.artist}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}

              {state.items.length > 10 && (
                <DropdownMenuItem disabled>
                  <span className="text-xs text-muted-foreground">... and {state.items.length - 10} more tracks</span>
                </DropdownMenuItem>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
