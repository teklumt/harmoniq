"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { MiniPlayer } from "@/components/mini-player";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, TrendingUp, Clock, Heart, MoreHorizontal } from "lucide-react";
import { useMusic } from "@/components/music-context";

export default function SearchPage() {
  const {
    setCurrentTrack,
    setIsPlaying,
    toggleLike,
    likedTracks,
    setSearchQuery,
  } = useMusic();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query && query !== searchInput) {
      setSearchInput(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = (query: string) => {
    const mockResults = [
      {
        id: `${query}-result1`,
        title: `${query} Mix`,
        artist: "Various Artists",
        duration: "45:30",
        type: "playlist",
        cover: "/abstract-geometric-shapes.png",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: `${query}-result2`,
        title: `Best of ${query}`,
        artist: "Top Artists",
        duration: "3:45",
        type: "track",
        cover: "/synthwave-album-cover-purple-neon.png",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: `${query}-result3`,
        title: `${query} Radio`,
        artist: "Auto-generated",
        duration: "∞",
        type: "radio",
        cover: "/peaceful-sunset-album-cover-orange-pink.png",
        audioUrl:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
    ];
    setSearchResults(mockResults);
  };

  const trendingSearches = [
    "Synthwave",
    "Lo-fi Hip Hop",
    "Ambient",
    "Electronic",
    "Chill Out",
  ];
  const recentSearches = ["Neon Dreams", "Peaceful Sunset", "Workout Beats"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchQuery(searchInput);
      performSearch(searchInput);
      router.push(`/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  const handlePlayResult = (result: any) => {
    setCurrentTrack({
      id: result.id,
      title: result.title,
      artist: result.artist,
      duration: result.duration,
      cover: result.cover,
      audioUrl: result.audioUrl,
    });
    setIsPlaying(true);
  };

  const handleTrendingClick = (trend: string) => {
    setSearchInput(trend);
    setSearchQuery(trend);
    performSearch(trend);
    router.push(`/search?q=${encodeURIComponent(trend)}`);
  };

  const handleMoreOptions = (result: any) => {
    console.log("[v0] More options for:", result.title);
    // In a real app, this would show a dropdown menu with options like "Add to playlist", "Share", etc.
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>

        <form onSubmit={handleSearch} className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="What do you want to listen to?"
            className="pl-10 h-12 text-lg rounded-full border-2 focus:border-primary"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="space-y-3">
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handlePlayResult(result)}
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={result.cover || "/placeholder.svg"}
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{result.title}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {result.artist} • {result.type}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {result.duration}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(result.id);
                    }}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        likedTracks.has(result.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoreOptions(result);
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Searches */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Searches
          </h2>
          <div className="space-y-2">
            {recentSearches.map((search, index) => (
              <Button
                key={index}
                variant="ghost"
                className="w-full justify-start h-auto p-3"
                onClick={() => handleTrendingClick(search)}
              >
                <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                {search}
              </Button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Trending Now
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {trendingSearches.map((trend, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTrendingClick(trend)}
              >
                <CardContent className="p-4">
                  <img
                    src={`/abstract-geometric-shapes.png?height=80&width=160&query=${trend} music genre`}
                    alt={trend}
                    className="h-20 w-full object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-medium text-center">{trend}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <MiniPlayer />
      <BottomNav />
    </div>
  );
}
