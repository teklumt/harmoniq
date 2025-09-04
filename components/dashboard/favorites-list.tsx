"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Heart, MoreHorizontal, Music, Shuffle } from "lucide-react";
import { useQueue } from "@/contexts/queue-context";

const mockFavorites = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    genre: "Electronic",
    duration: "3:45",
    addedAt: "2 days ago",
    mp3Url: "https://example.com/audio/midnight-dreams.mp3",
    coverArt: "/midnight-dreams-album-cover.png",
  },
  {
    id: 2,
    title: "Ocean Waves",
    artist: "Coastal Sounds",
    genre: "Ambient",
    duration: "4:12",
    addedAt: "1 week ago",
    mp3Url: "https://example.com/audio/ocean-waves.mp3",
    coverArt: "/album-cover-ocean-waves.png",
  },
  {
    id: 3,
    title: "City Lights",
    artist: "Urban Melody",
    genre: "Pop",
    duration: "3:28",
    addedAt: "2 weeks ago",
    mp3Url: "https://example.com/audio/city-lights.mp3",
    coverArt: "/album-cover-city-lights.jpg",
  },
  {
    id: 4,
    title: "Mountain High",
    artist: "Nature Sounds",
    genre: "Folk",
    duration: "4:05",
    addedAt: "3 weeks ago",
    mp3Url: "https://example.com/audio/mountain-high.mp3",
    coverArt: "/album-cover-mountain-high.png",
  },
  {
    id: 5,
    title: "Electric Pulse",
    artist: "Neon Waves",
    genre: "EDM",
    duration: "3:52",
    addedAt: "1 month ago",
    mp3Url: "https://example.com/audio/electric-pulse.mp3",
    coverArt: "/album-cover-nocturnal-vibes.jpg",
  },
];

export function FavoritesList() {
  const [favorites, setFavorites] = useState(mockFavorites);
  const { controls, actions } = useQueue();

  const handleRemoveFavorite = (id: number) => {
    console.log("[v0] Removing favorite:", id);
    setFavorites(favorites.filter((fav) => fav.id !== id));
  };

  const handlePlayAll = () => {
    const tracks = favorites.map((fav) => ({
      id: fav.id.toString(),
      title: fav.title,
      artist: fav.artist,
      mp3Url: fav.mp3Url,
      duration:
        Number.parseInt(fav.duration.split(":")[0]) * 60 +
        Number.parseInt(fav.duration.split(":")[1]),
      genre: fav.genre,
      coverArt: fav.coverArt,
    }));

    const now = new Date().toISOString();
    const playlist = {
      id: "favorites",
      name: "Liked Songs",
      description: "Your favorite tracks",
      tracks,
      coverArt: "/playlist-cover-chill-vibes.jpg",
      isPublic: false,
      createdBy: "user", // Replace with actual user id or name if available
      totalDuration: tracks.reduce((sum, track) => sum + track.duration, 0),
      trackCount: tracks.length,
      createdAt: now,
      updatedAt: now,
      // Add any other required fields with default or mock values if needed
    };

    actions.addPlaylist(playlist);
  };

  const handleShuffle = () => {
    handlePlayAll();
    controls.toggleShuffle();
  };

  const handlePlayTrack = (favorite: (typeof favorites)[0]) => {
    const track = {
      id: favorite.id.toString(),
      title: favorite.title,
      artist: favorite.artist,
      mp3Url: favorite.mp3Url,
      duration:
        Number.parseInt(favorite.duration.split(":")[0]) * 60 +
        Number.parseInt(favorite.duration.split(":")[1]),
      genre: favorite.genre,
      coverArt: favorite.coverArt,
    };

    actions.addTrack(track, {
      type: "playlist",
      name: "Liked Songs",
      id: "favorites",
    });
  };

  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 md:pt-6">
          <div className="text-center space-y-4">
            <Heart className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold">
                No favorites yet
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Start exploring music and add songs to your favorites!
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
            >
              Discover Music
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg md:text-xl">
            Liked Songs ({favorites.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleShuffle}
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none text-xs md:text-sm bg-transparent"
            >
              <Shuffle className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
              Shuffle
            </Button>
            <Button
              onClick={handlePlayAll}
              size="sm"
              className="flex-1 sm:flex-none text-xs md:text-sm"
            >
              <Play className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
              Play All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="space-y-2 md:space-y-3">
          {favorites.map((favorite, index) => (
            <div
              key={favorite.id}
              className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-xs md:text-sm text-muted-foreground w-6 md:w-8 text-center shrink-0">
                {index + 1}
              </span>

              <div className="w-8 h-8 md:w-10 md:h-10 bg-muted rounded-md flex items-center justify-center shrink-0">
                <Music className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <h3 className="font-medium truncate text-sm md:text-base">
                    {favorite.title}
                  </h3>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full w-fit">
                    {favorite.genre}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {favorite.artist}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground sm:hidden">
                  <span>Added {favorite.addedAt}</span>
                  <span>•</span>
                  <span>{favorite.duration}</span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm text-muted-foreground shrink-0">
                <span>Added {favorite.addedAt}</span>
                <span>{favorite.duration}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 md:h-9 md:w-9 p-0"
                  onClick={() => handlePlayTrack(favorite)}
                >
                  <Play className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="text-accent hover:text-accent h-8 w-8 md:h-9 md:w-9 p-0"
                >
                  <Heart className="h-3 w-3 md:h-4 md:w-4 fill-current" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 md:h-9 md:w-9 p-0 hidden sm:flex"
                >
                  <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
