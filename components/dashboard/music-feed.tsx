"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Heart, MoreHorizontal, Music } from "lucide-react";
import { useQueue } from "@/contexts/queue-context";
import { useEffect, useState } from "react";

const feedItems = [
  {
    id: 1,
    title: "Summer Vibes",
    artist: "Tropical Beats",
    genre: "Electronic",
    duration: "4:23",
    uploadedBy: "DJ Sunshine",
    uploadedAt: "2 hours ago",
    mp3Url: "https://example.com/audio/summer-vibes.mp3",
    coverArt: "/album-cover-ocean-waves.png",
  },
];

export function MusicFeed() {
  const { controls, actions } = useQueue();
  const [recentUploads, setRecentUploads] = useState([] as typeof feedItems);

  const handlePlayTrack = (item: (typeof feedItems)[0]) => {
    const track = {
      id: item.id.toString(),
      title: item.title,
      artist: item.artist,
      mp3Url: item.mp3Url,
      duration:
        Number.parseInt(item.duration.split(":")[0]) * 60 +
        Number.parseInt(item.duration.split(":")[1]),
      genre: item.genre,
      coverArt: item.coverArt,
    };

    actions.addTrack(track, {
      type: "single",
      name: item.title,
      id: item.id.toString(),
    });
  };

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const response = await fetch("/api/music/feed?limit=20&offset=0");
        const data = await response.json();
        if (data.success && Array.isArray(data.items)) {
          // Map API data to local format if needed
          setRecentUploads(
            data.items.map((item: any) => ({
              id: item.id,
              title: item.title,
              artist: item.artist,
              genre: item.genre,
              duration: "--:--", // Replace with actual duration if available
              addedAt: item.uploadedAt
                ? new Date(item.uploadedAt).toLocaleDateString()
                : "Recently",
              mp3Url: item.mp3Url || item.url,
              coverArt: "/placeholder-logo.png", // Replace with actual coverArt if available
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    }
    fetchFavorites();
  }, []);

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Latest Uploads</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="space-y-3 md:space-y-4">
          {recentUploads?.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                <Music className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <h3 className="font-semibold truncate text-sm md:text-base">
                    {item.title}
                  </h3>
                  <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full w-fit">
                    {item.genre}
                  </span>
                </div>
                <p className="text-muted-foreground truncate text-xs md:text-sm">
                  {item.artist}
                </p>
                <p className="text-xs md:text-sm text-muted-foreground">
                  <span className="sm:hidden">
                    By {item.uploadedBy} • {item.uploadedAt}
                  </span>
                  <span className="hidden sm:inline">
                    Uploaded by {item.uploadedBy} • {item.uploadedAt}
                  </span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 shrink-0">
                <span className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  {item.duration}
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 md:h-9 md:w-9 p-0"
                  >
                    <Heart className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 md:h-9 md:w-9 p-0"
                    onClick={() => handlePlayTrack(item)}
                  >
                    <Play className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 md:h-9 md:w-9 p-0 hidden sm:flex"
                  >
                    <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </div>
                <span className="text-xs text-muted-foreground sm:hidden">
                  {item.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
