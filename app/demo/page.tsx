"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQueue } from "@/contexts/queue-context";
import { MusicPlayer } from "@/components/player/music-player";
import { QueuePanel } from "@/components/queue/queue-panel";
import type { Track, Album, Playlist } from "@/lib/types/music";
import {
  Play,
  Plus,
  ListMusic,
  Disc3,
  Music,
  Heart,
  Share2,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

// Sample data for demonstration
const sampleTracks: Track[] = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    album: "Nocturnal Vibes",
    duration: 245,
    mp3Url: "/audio-file.png", // In real app, this would be actual audio URLs
    coverArt: "/midnight-dreams-album-cover.png",
    genre: "Electronic",
    trackNumber: 1,
  },
  {
    id: "2",
    title: "Ocean Waves",
    artist: "Coastal Sounds",
    album: "Nature's Symphony",
    duration: 198,
    mp3Url: "/audio-file.png",
    coverArt: "/album-cover-ocean-waves.png",
    genre: "Ambient",
    trackNumber: 2,
  },
  {
    id: "3",
    title: "City Lights",
    artist: "Urban Pulse",
    album: "Metropolitan",
    duration: 312,
    mp3Url: "/audio-file.png",
    coverArt: "/album-cover-city-lights.jpg",
    genre: "Pop",
    trackNumber: 1,
    isExplicit: true,
  },
  {
    id: "4",
    title: "Mountain High",
    artist: "Alpine Echo",
    album: "Peaks & Valleys",
    duration: 267,
    mp3Url: "/audio-file.png",
    coverArt: "/album-cover-mountain-high.png",
    genre: "Folk",
    trackNumber: 3,
  },
];

const sampleAlbum: Album = {
  id: "album-1",
  title: "Nocturnal Vibes",
  artist: "Luna Eclipse",
  coverArt: "/album-cover-nocturnal-vibes.jpg",
  releaseDate: "2024-01-15",
  genre: "Electronic",
  tracks: sampleTracks.slice(0, 2),
  totalDuration: 443,
  trackCount: 2,
};

const samplePlaylist: Playlist = {
  id: "playlist-1",
  name: "Chill Vibes",
  description: "Perfect tracks for relaxing and unwinding",
  coverArt: "/playlist-cover-chill-vibes.jpg",
  isPublic: true,
  createdBy: "user-1",
  tracks: sampleTracks,
  totalDuration: 1022,
  trackCount: 4,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-15T00:00:00Z",
};

export default function DemoPage() {
  const { actions, state, controls } = useQueue();
  const [showFullPlayer, setShowFullPlayer] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayTrack = (track: Track) => {
    actions.clearQueue();
    actions.addTrack(track);
  };

  const handleAddTrack = (track: Track) => {
    actions.addTrack(track);
  };

  const handlePlayAlbum = () => {
    actions.clearQueue();
    actions.addAlbum(sampleAlbum);
  };

  const handlePlayPlaylist = () => {
    actions.clearQueue();
    actions.addPlaylist(samplePlaylist);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Harmoniq Demo</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Demo Info */}
            <Card>
              <CardHeader>
                <CardTitle>Music Queue Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This demo showcases the global music queue system. You can add
                  individual tracks, entire albums, or playlists to the queue.
                  The player will appear at the bottom of the screen when music
                  is added.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setShowFullPlayer(!showFullPlayer)}
                    variant="outline"
                  >
                    {showFullPlayer ? "Hide" : "Show"} Full Player
                  </Button>
                  <Button
                    onClick={() => setShowQueue(!showQueue)}
                    variant="outline"
                  >
                    {showQueue ? "Hide" : "Show"} Queue Panel
                  </Button>
                  <Button
                    onClick={actions.clearQueue}
                    variant="destructive"
                    disabled={state.items.length === 0}
                  >
                    Clear Queue
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Individual Tracks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Individual Tracks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleTracks.map((track, index) => (
                    <div key={track.id}>
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                          <Music className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">
                              {track.title}
                            </h4>
                            {track.isExplicit && (
                              <Badge variant="secondary" className="text-xs">
                                E
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {track.artist}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {track.genre}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTime(track.duration)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handlePlayTrack(track)}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Play
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddTrack(track)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                      {index < sampleTracks.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Album */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Disc3 className="h-5 w-5" />
                  Sample Album
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <Disc3 className="h-8 w-8 text-muted-foreground" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {sampleAlbum.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {sampleAlbum.artist}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{sampleAlbum.trackCount} tracks</span>
                      <span>{formatTime(sampleAlbum.totalDuration)}</span>
                      <span>{sampleAlbum.releaseDate}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Button onClick={handlePlayAlbum}>
                        <Play className="h-4 w-4 mr-1" />
                        Play Album
                      </Button>
                      <Button variant="outline">
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Playlist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ListMusic className="h-5 w-5" />
                  Sample Playlist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <ListMusic className="h-8 w-8 text-muted-foreground" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {samplePlaylist.name}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {samplePlaylist.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{samplePlaylist.trackCount} tracks</span>
                      <span>{formatTime(samplePlaylist.totalDuration)}</span>
                      <Badge variant="outline" className="text-xs">
                        {samplePlaylist.isPublic ? "Public" : "Private"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Button onClick={handlePlayPlaylist}>
                        <Play className="h-4 w-4 mr-1" />
                        Play Playlist
                      </Button>
                      <Button variant="outline">
                        <Heart className="h-4 w-4 mr-1" />
                        Like
                      </Button>
                      <Button variant="outline">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Full Player */}
            {/* {showFullPlayer && (
              <Card>
                <CardHeader>
                  <CardTitle>Full Player</CardTitle>
                </CardHeader>
                <CardContent>
                  <MusicPlayer
                    onExpandPlayer={() => setShowFullPlayer(false)}
                  />
                </CardContent>
              </Card>
            )} */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Queue Panel */}
            {showQueue && <QueuePanel />}

            {/* Queue Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Queue Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tracks in queue:
                    </span>
                    <span className="text-sm font-medium">
                      {state.items.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Current track:
                    </span>
                    <span className="text-sm font-medium">
                      {state.currentIndex >= 0
                        ? state.currentIndex + 1
                        : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Playing:
                    </span>
                    <span className="text-sm font-medium">
                      {state.isPlaying ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Shuffle:
                    </span>
                    <span className="text-sm font-medium">
                      {state.isShuffled ? "On" : "Off"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Repeat:
                    </span>
                    <span className="text-sm font-medium capitalize">
                      {state.repeatMode}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
