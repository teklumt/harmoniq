"use client";

import { Button } from "@/components/ui/button";
import { useQueue } from "@/contexts/queue-context";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { getRandomUnsplashImage } from "@/utils/images";

interface MiniPlayerProps {
  className?: string;
  onExpand?: () => void;
}

export function MiniPlayer({ className, onExpand }: MiniPlayerProps) {
  const { state, controls, currentTrack } = useQueue();

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeek = (value: number[]) => {
    controls.seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    controls.setVolume(value[0]);
  };

  const toggleMute = () => {
    controls.setVolume(state.volume === 0 ? 1 : 0);
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className={`bg-background border-t border-border p-3 ${className}`}>
      <div className="flex items-center gap-3">
        {/* Album Art & Track Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button
            onClick={onExpand}
            className="relative w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <Image
              src={currentTrack.coverArt || "/placeholder.svg"}
              alt={`${currentTrack.title} cover`}
              fill
              className="object-cover"
            />
          </button>

          <div className="min-w-0 flex-1">
            <button onClick={onExpand} className="text-left hover:underline">
              <h4 className="text-sm font-medium truncate">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {currentTrack.artist}
              </p>
            </button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(state.currentTime)}
          </span>
          <Slider
            value={[state.currentTime]}
            onValueChange={handleSeek}
            max={state.duration || 100}
            step={1}
            className="cursor-pointer flex-1"
          />
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(state.duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={controls.previous}
                  disabled={state.items.length <= 1}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Previous track</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  onClick={state.isPlaying ? controls.pause : controls.play}
                  className="w-8 h-8 rounded-full"
                >
                  {state.isPlaying ? (
                    <Pause className="h-3 w-3" />
                  ) : (
                    <Play className="h-3 w-3 ml-0.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{state.isPlaying ? "Pause" : "Play"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={controls.next}
                  disabled={state.items.length <= 1}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Next track</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Volume Control */}
          <div className="hidden lg:flex items-center gap-2 ml-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={toggleMute}>
                    {state.volume === 0 ? (
                      <VolumeX className="h-4 w-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
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
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden mt-2">
        <Slider
          value={[state.currentTime]}
          onValueChange={handleSeek}
          max={state.duration || 100}
          step={1}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{formatTime(state.currentTime)}</span>
          <span>{formatTime(state.duration)}</span>
        </div>
      </div>
    </div>
  );
}
