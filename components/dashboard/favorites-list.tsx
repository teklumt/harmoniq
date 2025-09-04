"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Heart, MoreHorizontal, Music, Shuffle } from "lucide-react";
import { useQueue } from "@/contexts/queue-context";
import { authClient } from "@/lib/auth-client";

interface FavoriteTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  addedAt: string;
  mp3Url: string;
  coverArt: string;
}

export function FavoritesList() {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const userId = session?.user?.id;
  const [favorites, setFavorites] = useState<FavoriteTrack[]>([]);
  const { controls, actions } = useQueue();

  useEffect(() => {
    let isMounted = true;
    authClient.getSession()
      .then((result: any) => {
        if (isMounted) {
          if ('data' in result) {
            setSession(result.data);
            setError(null);
          } else if ('error' in result) {
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
    return () => { isMounted = false; };
  }, []);

  const handleToggleFavorite = async (musicId: string, isFavorited: boolean) => {
    if (!userId) return; // Prevent action if user is not authenticated
    try {
      if (isFavorited) {
        // Remove favorite
        const response = await fetch(`/api/music/favorites?trackId=${musicId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setFavorites(favorites.filter((fav) => fav.id !== musicId));
        }
      } else {
        // Add favorite
        const response = await fetch("/api/music/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackId: musicId }),
        });
        if (response.ok) {
          // Refetch favorites to ensure UI is in sync
          fetchFavorites();
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handlePlayAll = () => {
    const tracks = favorites.map((fav) => ({
      id: fav.id,
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
      createdBy: userId || "user",
      totalDuration: tracks.reduce((sum, track) => sum + track.duration, 0),
      trackCount: tracks.length,
      createdAt: now,
      updatedAt: now,
    };

    actions.addPlaylist(playlist);
  };

  const handleShuffle = () => {
    handlePlayAll();
    controls.toggleShuffle();
  };

  const handlePlayTrack = (favorite: FavoriteTrack) => {
    const track = {
      id: favorite.id,
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

  const fetchFavorites = async () => {
    if (!userId) return; // Prevent fetch if user is not authenticated
    try {
      const response = await fetch("/api/music/favorites");
      const data = await response.json();
      if (data.success && Array.isArray(data.items)) {
        setFavorites(
          data.items.map((item: any) => ({
            id: item.id,
            title: item.title,
            artist: item.artist,
            genre: item.genre,
            duration: item.duration || "--:--",
            addedAt: item.addedAt
              ? new Date(item.addedAt).toLocaleDateString()
              : "Recently",
            mp3Url: item.mp3Url,
            coverArt: item.coverArt || "/placeholder-logo.png",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    if (!error) {
      fetchFavorites();
    }
  }, [userId, error]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-4 md:pt-6">
          <div className="text-center space-y-4">
            <div className="h-12 w-12 md:h-16 md:w-16 mx-auto animate-pulse bg-muted rounded-full" />
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold">
                Loading...
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Please wait while we load your favorites.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userId) {
    return (
      <Card>
        <CardContent className="p-4 md:pt-6">
          <div className="text-center space-y-4">
            <Heart className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold">
                Please sign in
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Sign in to view and manage your favorite songs.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => { window.location.href = "/login"; } } })}
            >
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                  onClick={() => handleToggleFavorite(favorite.id, true)}
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