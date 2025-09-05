"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useQueue } from "@/contexts/queue-context";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  MoreHorizontal,
  Maximize2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { getRandomUnsplashImage } from "@/utils/images";

interface MusicPlayerProps {
  className?: string;
  compact?: boolean;
  onExpandPlayer?: () => void;
}

export function MusicPlayer({
  className,
  compact = false,
  onExpandPlayer,
}: MusicPlayerProps) {
  const { state, controls, currentTrack, audioRef } = useQueue();
  const [isLiked, setIsLiked] = useState(false);

  // Update audio source when current track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    console.log(" " " Loading track:", currentTrack.title, currentTrack.mp3Url);
    //audio.src = "https://res.cloudinary.com/dtjzf1zja/raw/upload/v1757024235/music/d5yw11uda4eeb6aqefce";
    audio.src = currentTrack.mp3Url;
    audio.load();

    // Auto-play if the player was playing
    if (state.isPlaying) {
      audio.play().catch(console.error);
    }
  }, [currentTrack, audioRef]);

  // Sync audio element with state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = state.volume;
  }, [state.volume, audioRef]);

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

  const getRepeatIcon = () => {
    switch (state.repeatMode) {
      case "one":
        return <Repeat1 className="h-4 w-4" />;
      case "all":
        return <Repeat className="h-4 w-4" />;
      default:
        return <Repeat className="h-4 w-4" />;
    }
  };

  const getRepeatTooltip = () => {
    switch (state.repeatMode) {
      case "one":
        return "Repeat: One";
      case "all":
        return "Repeat: All";
      default:
        return "Repeat: Off";
    }
  };

  if (!currentTrack) {
    return (
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-center text-muted-foreground">
          <p className="text-sm">No track selected</p>
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={`p-3 ${className}`}>
        <div className="flex items-center gap-3">
          {/* Album Art */}
          <div className="relative w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={getRandomUnsplashImage() || "/placeholder.svg"}
              alt={`${currentTrack.title} cover`}
              fill
              className="object-cover"
            />
          </div>

          {/* Track Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium truncate">
              {currentTrack.title}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {currentTrack.artist}
            </p>
          </div>

          {/* Compact Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={controls.previous}
              disabled={state.items.length <= 1}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

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

            <Button
              variant="ghost"
              size="sm"
              onClick={controls.next}
              disabled={state.items.length <= 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>

            {onExpandPlayer && (
              <Button variant="ghost" size="sm" onClick={onExpandPlayer}>
                <Maximize2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
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
      </Card>
    );
  }

  return (
    <Card className={`p-6 hidden ${className}`}>
      <div className="space-y-4">
        {/* Track Info Section */}
        <div className="flex items-start gap-4">
          {/* Album Art */}
          <div className="relative w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            {currentTrack.coverArt ? (
              <Image
                src={currentTrack.coverArt || "/placeholder.svg"}
                alt={`${currentTrack.title} cover`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Track Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">
              {currentTrack.title}
            </h3>
            <p className="text-muted-foreground truncate">
              {currentTrack.artist}
            </p>
            {currentTrack.album && (
              <p className="text-sm text-muted-foreground truncate">
                {currentTrack.album}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2">
              {currentTrack.genre && (
                <span className="text-xs bg-muted px-2 py-1 rounded-full">
                  {currentTrack.genre}
                </span>
              )}
              {currentTrack.isExplicit && (
                <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">
                  Explicit
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={
                      isLiked ? "text-red-500" : "text-muted-foreground"
                    }
                  >
                    <Heart
                      className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {isLiked ? "Remove from favorites" : "Add to favorites"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                <DropdownMenuItem>Share Track</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>View Album</DropdownMenuItem>
                <DropdownMenuItem>View Artist</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <Slider
            value={[state.currentTime]}
            onValueChange={handleSeek}
            max={state.duration || 100}
            step={1}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Controls Section */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={controls.toggleShuffle}
                    className={
                      state.isShuffled
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                    disabled={state.items.length <= 1}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Shuffle: {state.isShuffled ? "On" : "Off"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Center Controls */}
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={controls.previous}
                    disabled={state.items.length <= 1}
                  >
                    <SkipBack className="h-5 w-5" />
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
                    size="lg"
                    onClick={state.isPlaying ? controls.pause : controls.play}
                    className="w-12 h-12 rounded-full"
                  >
                    {state.isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
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
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Next track</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={controls.toggleRepeat}
                    className={
                      state.repeatMode !== "none"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }
                    disabled={state.items.length <= 1}
                  >
                    {getRepeatIcon()}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{getRepeatTooltip()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Volume Section */}
        <div className="flex items-center gap-3 pt-2 border-t">
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

          <div className="flex-1 max-w-32">
            <Slider
              value={[state.volume]}
              onValueChange={handleVolumeChange}
              max={1}
              step={0.01}
              className="cursor-pointer"
            />
          </div>

          <span className="text-xs text-muted-foreground w-8 text-right">
            {Math.round(state.volume * 100)}%
          </span>
        </div>
      </div>
    </Card>
  );
}
