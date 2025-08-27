"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Heart,
} from "lucide-react";
import { useMusic } from "@/components/music-context";

export function MiniPlayer() {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    playNext,
    playPrevious,
    toggleLike,
    likedTracks,
    currentTime,
    duration,
    volume,
    setVolume,
    seekTo,
  } = useMusic();

  if (!currentTrack) return null;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleProgressChange = (value: number[]) => {
    seekTo((value[0] / 100) * duration);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  console.log("currentTrack", currentTrack);

  return (
    <div className="fixed bottom-20 left-0 right-0 bg-background/95 backdrop-blur-sm border-t px-4 py-3">
      <div className="flex items-center gap-4">
        {/* Track Info */}

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex-shrink-0">
            {currentTrack.cover && (
              <img
                src={currentTrack.cover || "/placeholder.svg"}
                alt={currentTrack.title}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-medium truncate">{currentTrack.title}</h4>
            <p className="text-sm text-muted-foreground truncate">
              {currentTrack.artist}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={() => toggleLike(currentTrack.id)}
          >
            <Heart
              className={`h-4 w-4 ${
                likedTracks.has(currentTrack.id)
                  ? "fill-red-500 text-red-500"
                  : ""
              }`}
            />
          </Button>
        </div>

        {/* Controls */}
        {/* <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={playPrevious}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={playNext}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div> */}

        <div className="text-red-500 ">
          <audio src={currentTrack.audioUrl} controls />
        </div>

        {/* Progress & Volume */}
        {/* <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs">
          <span className="text-xs text-muted-foreground">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[progressPercentage]}
            onValueChange={handleProgressChange}
            max={100}
            step={1}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground">
            {formatTime(duration)}
          </span>
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="w-20"
          />
        </div> */}
      </div>

      {/* Mobile Progress Bar */}
      {/* <div className="md:hidden mt-2">
        <Slider
          value={[progressPercentage]}
          onValueChange={handleProgressChange}
          max={100}
          step={1}
          className="w-full"
        />
      </div> */}
    </div>
  );
}
