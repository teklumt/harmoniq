"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Heart, MoreHorizontal, Music } from "lucide-react";
import { useQueue } from "@/contexts/queue-context";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

interface FeedItem {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  uploadedBy: string;
  uploadedAt: string;
  mp3Url: string;
  coverArt: string;
  isFavorited: boolean;
}

export function MusicFeed() {
  const { controls, actions } = useQueue();
  const [recentUploads, setRecentUploads] = useState<FeedItem[]>([]);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const userId = session?.user?.id;

  useEffect(() => {
    let isMounted = true;
    authClient.getSession()
      .then((result: any) => {
        if (isMounted) {
          if ("data" in result) {
            setSession(result.data);
            setError(null);
          } else if ("error" in result) {
            setSession(null);
            setError(result.error);
          }
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          setSession(null);
          setError(err);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFavorite = async (trackId: string, isFavorited: boolean) => {
    if (!userId) {
      alert("Please sign in to favorite tracks.");
      return;
    }
    try {
      let response;
      if (isFavorited) {
        // Remove favorite
        response = await fetch(`/api/music/favorites?trackId=${trackId}`, {
          method: "DELETE",
        });
      } else {
        // Add favorite
        response = await fetch("/api/music/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackId }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Failed to ${isFavorited ? "remove" : "add"} favorite:`, errorData.message);
        alert(`Error: ${errorData.message}`);
        return;
      }

      // Update UI optimistically
      setRecentUploads(
        recentUploads.map((item) =>
          item.id === trackId ? { ...item, isFavorited: !isFavorited } : item
        )
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert("An error occurred while updating favorites. Please try again.");
    }
  };

  const handlePlayTrack = (item: FeedItem) => {
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
          // Map API data to local format
          const uploads = data.items.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            artist: item.artist,
            genre: item.genre,
            duration: item.duration || "--:--",
            uploadedBy: item.uploadedBy || "Unknown",
            uploadedAt: item.uploadedAt
              ? new Date(item.uploadedAt).toLocaleDateString()
              : "Recently",
            mp3Url: item.mp3Url || item.url,
            coverArt: item.coverArt || "/placeholder-logo.png",
            isFavorited: false, // Default to false; can be updated if API provides favorite status
          }));

          // Optionally fetch favorite status if user is authenticated
          if (userId) {
            const favResponse = await fetch("/api/music/favorites");
            const favData = await favResponse.json();
            if (favData.success && Array.isArray(favData.items)) {
              const favoriteIds = new Set(favData.items.map((fav: any) => fav.id));
              setRecentUploads(
                uploads.map((item: { id: unknown; }) => ({
                  ...item,
                  isFavorited: favoriteIds.has(item.id),
                }))
              );
            } else {
              setRecentUploads(uploads);
            }
          } else {
            setRecentUploads(uploads);
          }
        }
      } catch (error) {
        console.error("Error fetching feed:", error);
        alert("An error occurred while fetching the music feed. Please try again.");
      }
    }
    fetchFavorites();
  }, [userId]);

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
                    className={`h-8 w-8 md:h-9 md:w-9 p-0 ${
                      item.isFavorited ? "text-accent" : "text-muted-foreground"
                    } hover:text-accent`}
                    onClick={() => handleToggleFavorite(item.id, item.isFavorited)}
                  >
                    <Heart
                      className={`h-3 w-3 md:h-4 md:w-4 ${
                        item.isFavorited ? "fill-current" : "fill-none"
                      }`}
                    />
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