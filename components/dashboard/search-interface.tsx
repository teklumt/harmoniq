"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, Heart, Music, User, Disc } from "lucide-react";
import { useQueue } from "@/contexts/queue-context";
import Image from "next/image";
import { getRandomUnsplashImage } from "@/utils/images";

const mockResults = {
  tracks: [
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "Luna Eclipse",
      genre: "Electronic",
      duration: "3:45",
      mp3Url: "https://example.com/audio/midnight-dreams.mp3",
      coverArt: "/midnight-dreams-album-cover.png",
    },
    {
      id: 2,
      title: "Ocean Waves",
      artist: "Coastal Sounds",
      genre: "Ambient",
      duration: "4:12",
      mp3Url: "https://example.com/audio/ocean-waves.mp3",
      coverArt: "/album-cover-ocean-waves.png",
    },
    {
      id: 3,
      title: "City Lights",
      artist: "Urban Melody",
      genre: "Pop",
      duration: "3:28",
      mp3Url: "https://example.com/audio/city-lights.mp3",
      coverArt: "/album-cover-city-lights.jpg",
    },
  ],
  artists: [
    { id: 1, name: "Luna Eclipse", genre: "Electronic", tracks: 12 },
    { id: 2, name: "Coastal Sounds", genre: "Ambient", tracks: 8 },
    { id: 3, name: "Urban Melody", genre: "Pop", tracks: 15 },
  ],
  albums: [
    {
      id: 1,
      title: "Night Sessions",
      artist: "Luna Eclipse",
      year: 2024,
      tracks: 10,
    },
    {
      id: 2,
      title: "Ocean Dreams",
      artist: "Coastal Sounds",
      year: 2023,
      tracks: 8,
    },
    {
      id: 3,
      title: "City Stories",
      artist: "Urban Melody",
      year: 2024,
      tracks: 12,
    },
  ],
};

export function SearchInterface() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { controls, actions } = useQueue();

  const [tracksFromApi, setTracksFromApi] = useState<any[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<any[]>([]);
  const [artistsFromTracks, setArtistsFromTracks] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    // Filter tracks from API based on query
    const lowerQuery = query.toLowerCase();
    const results = tracksFromApi.filter(
      (track) =>
        (track.title && track.title.toLowerCase().includes(lowerQuery)) ||
        (track.artist && track.artist.toLowerCase().includes(lowerQuery))
    );
    setFilteredTracks(results);

    // Extract unique artists from filtered tracks
    const artistMap: {
      [name: string]: { name: string; genre?: string; tracks: number };
    } = {};
    results.forEach((track) => {
      if (track.artist) {
        if (!artistMap[track.artist]) {
          artistMap[track.artist] = {
            name: track.artist,
            genre: track.genre,
            tracks: 1,
          };
        } else {
          artistMap[track.artist].tracks += 1;
        }
      }
    });
    setArtistsFromTracks(Object.values(artistMap));

    setHasSearched(true);
    setIsSearching(false);
  };

  const handlePlayTrack = (track: (typeof mockResults.tracks)[0]) => {
    const trackData = {
      id: track.id.toString(),
      title: track.title,
      artist: track.artist,
      mp3Url: track.mp3Url,
      duration: track.duration || "--:--",
      genre: track.genre,
      coverArt: getRandomUnsplashImage(),
    };

    actions.addTrack(trackData, {
      type: "single",
      name: track.title,
      id: track.id.toString(),
    });
  };

  useEffect(() => {
    async function fetchTracks() {
      try {
        const response = await fetch("/api/music/feed?limit=50&offset=0");
        const data = await response.json();
        if (data.success) {
          setTracksFromApi(data.items);
        } else {
          console.error("Failed to fetch tracks from API");
        }
      } catch (error) {
        console.error("Error fetching tracks from API:", error);
      }
    }

    fetchTracks();
  }, []);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Search Form */}
      <Card>
        <CardContent className="p-4 md:pt-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for songs, artists, or albums..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="w-full sm:w-auto"
            >
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {hasSearched && (
        <Tabs defaultValue="tracks" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="tracks" className="flex-1 sm:flex-none">
                Tracks
              </TabsTrigger>
              <TabsTrigger value="artists" className="flex-1 sm:flex-none">
                Artists
              </TabsTrigger>
              {/* <TabsTrigger value="albums" className="flex-1 sm:flex-none">
                Albums
              </TabsTrigger> */}
            </TabsList>
          </div>

          <TabsContent value="tracks" className="space-y-3 md:space-y-4">
            {filteredTracks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No tracks found for "{query}"
              </div>
            ) : (
              filteredTracks.map((track) => (
                <Card key={track.id}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                        <Music className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-semibold truncate text-sm md:text-base">
                          {track.title}
                        </h3>
                        <p className="text-muted-foreground truncate text-xs md:text-sm">
                          {track.artist}
                        </p>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                          {track.genre}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 shrink-0">
                        <span className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                          {track.duration || "--:--"}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handlePlayTrack(track)}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>
                        <span className="text-xs text-muted-foreground sm:hidden">
                          {track.duration || "--:--"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Artists tab: show unique artists from filtered tracks */}
          <TabsContent value="artists" className="space-y-3 md:space-y-4">
            {artistsFromTracks.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No artists found for "{query}"
              </div>
            ) : (
              artistsFromTracks.map((artist) => (
                <Card key={artist.name}>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-full flex items-center justify-center shrink-0">
                        {/* <User className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" /> */}
                        <Image
                          src={getRandomUnsplashImage()}
                          alt={artist.name}
                          width={64}
                          height={64}
                          className="h-10 w-10 md:h-12 md:w-12 object-cover rounded-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h3 className="font-semibold truncate text-sm md:text-base">
                          {artist.name}
                        </h3>
                        <p className="text-muted-foreground text-xs md:text-sm">
                          {artist.genre}
                        </p>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {artist.tracks} tracks
                        </p>
                      </div>
                      {/* <Button
                        variant="outline"
                        size="sm"
                        className="shrink-0 bg-transparent"
                      >
                        Follow
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="albums" className="space-y-3 md:space-y-4">
            {mockResults.albums.map((album) => (
              <Card key={album.id}>
                <CardContent className="p-3 md:p-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <Disc className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-semibold truncate text-sm md:text-base">
                        {album.title}
                      </h3>
                      <p className="text-muted-foreground truncate text-xs md:text-sm">
                        {album.artist}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {album.year} • {album.tracks} tracks
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
