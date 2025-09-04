"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Music, Play, MoreHorizontal, Download } from "lucide-react";
import { useQueue } from "@/contexts/queue-context";

const mockPlaylists = [
  {
    id: 1,
    name: "Chill Vibes",
    description: "Relaxing music for work",
    tracks: 24,
    duration: "1h 32m",
    trackList: [
      {
        id: "1",
        title: "Midnight Dreams",
        artist: "Luna Eclipse",
        mp3Url: "https://example.com/audio/midnight-dreams.mp3",
        duration: 225,
        genre: "Electronic",
        coverArt: "/midnight-dreams-album-cover.png",
      },
      {
        id: "2",
        title: "Ocean Waves",
        artist: "Coastal Sounds",
        mp3Url: "https://example.com/audio/ocean-waves.mp3",
        duration: 252,
        genre: "Ambient",
        coverArt: "/album-cover-ocean-waves.png",
      },
    ],
  },
  {
    id: 2,
    name: "Workout Mix",
    description: "High energy tracks",
    tracks: 18,
    duration: "58m",
    trackList: [
      {
        id: "3",
        title: "Electric Pulse",
        artist: "Neon Waves",
        mp3Url: "https://example.com/audio/electric-pulse.mp3",
        duration: 232,
        genre: "EDM",
        coverArt: "/album-cover-nocturnal-vibes.jpg",
      },
    ],
  },
  {
    id: 3,
    name: "Road Trip",
    description: "Perfect for long drives",
    tracks: 31,
    duration: "2h 15m",
    trackList: [
      {
        id: "4",
        title: "City Lights",
        artist: "Urban Melody",
        mp3Url: "https://example.com/audio/city-lights.mp3",
        duration: 208,
        genre: "Pop",
        coverArt: "/album-cover-city-lights.jpg",
      },
    ],
  },
  {
    id: 4,
    name: "Study Focus",
    description: "Instrumental and ambient",
    tracks: 15,
    duration: "1h 8m",
    trackList: [
      {
        id: "5",
        title: "Mountain High",
        artist: "Nature Sounds",
        mp3Url: "https://example.com/audio/mountain-high.mp3",
        duration: 245,
        genre: "Folk",
        coverArt: "/album-cover-mountain-high.png",
      },
    ],
  },
];

export function PlaylistGrid() {
  const [playlists, setPlaylists] = useState(mockPlaylists);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });
  const { controls, actions } = useQueue();

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    console.log("[v0] Creating playlist:", newPlaylist);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const playlist = {
      id: playlists.length + 1,
      name: newPlaylist.name,
      description: newPlaylist.description,
      tracks: 0,
      duration: "0m",
      trackList: [],
    };

    setPlaylists([...playlists, playlist]);
    setNewPlaylist({ name: "", description: "" });
    setIsCreating(false);

    console.log("[v0] Playlist created:", playlist);
  };

  const handleSpotifyImport = () => {
    console.log("[v0] Spotify import initiated (placeholder)");
    alert(
      "Spotify playlist import would be implemented here. This would connect to Spotify API to import playlists."
    );
  };

  const handlePlayPlaylist = (playlist: (typeof playlists)[0]) => {
    const playlistData = {
      id: playlist.id.toString(),
      name: playlist.name,
      description: playlist.description,
      tracks: playlist.trackList,
      coverArt: "/playlist-cover-chill-vibes.jpg",
      isPublic: false,
      createdBy: "demo-user",
      totalDuration: playlist.trackList.reduce((sum, t) => sum + t.duration, 0),
      trackCount: playlist.trackList.length,
      followers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    actions.addPlaylist(playlistData);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg md:text-xl">
                Create New Playlist
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm md:text-base">
                  Playlist Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter playlist name"
                  value={newPlaylist.name}
                  onChange={(e) =>
                    setNewPlaylist({ ...newPlaylist, name: e.target.value })
                  }
                  required
                  className="text-sm md:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm md:text-base">
                  Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your playlist..."
                  value={newPlaylist.description}
                  onChange={(e) =>
                    setNewPlaylist({
                      ...newPlaylist,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="text-sm md:text-base resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full text-sm md:text-base"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Playlist"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          onClick={handleSpotifyImport}
          className="w-full sm:w-auto bg-transparent"
        >
          <Download className="mr-2 h-4 w-4" />
          Import from Spotify
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {playlists.map((playlist) => (
          <Card key={playlist.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-3 md:space-y-4">
                <div className="w-full h-24 sm:h-28 md:h-32 bg-muted rounded-lg flex items-center justify-center">
                  <Music className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-base md:text-lg truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 leading-relaxed">
                    {playlist.description}
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {playlist.tracks} tracks • {playlist.duration}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="flex-1 text-xs md:text-sm h-8 md:h-9"
                    onClick={() => handlePlayPlaylist(playlist)}
                  >
                    <Play className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    Play
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 md:h-9 md:w-9 p-0"
                  >
                    <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
