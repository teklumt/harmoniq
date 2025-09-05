"use client";

import type React from "react";
import { useState, useEffect } from "react";
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
import {
  Plus,
  Music,
  Play,
  MoreHorizontal,
  Download,
  Check,
} from "lucide-react";
import { useQueue } from "@/contexts/queue-context";
import { authClient } from "@/lib/auth-client";

interface Track {
  id: string;
  title: string;
  artist: string;
  mp3Url: string;
  duration: number;
  genre: string;
  coverArt: string;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: number;
  duration: string;
  trackList: Track[];
}

interface FeedTrack {
  id: string;
  title: string;
  artist: string;
  mp3Url: string;
  duration: string;
  genre: string;
  coverArt: string;
}

export function PlaylistGrid() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({
    name: "",
    description: "",
    trackIds: [] as string[],
  });
  const [availableTracks, setAvailableTracks] = useState<FeedTrack[]>([]);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const userId = session?.user?.id;
  const { controls, actions } = useQueue();

  useEffect(() => {
    let isMounted = true;
    authClient
      .getSession()
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

  const fetchPlaylists = async () => {
    if (!userId) return;
    try {
      const response = await fetch("/api/playlists");
      const data = await response.json();
      if (data.success && Array.isArray(data.playlists)) {
        setPlaylists(
          data.playlists.map((p: any) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            tracks: p.tracks.length,
            duration: formatDuration(
              p.tracks.reduce(
                (sum: number, t: any) =>
                  sum +
                  (t.music && typeof t.music.duration === "number"
                    ? t.music.duration
                    : 0),
                0
              )
            ),
            trackList: p.tracks.map((t: any) => ({
              id: t.music?.id || "",
              title: t.music?.title || "",
              artist: t.music?.author || "",
              mp3Url: t.music?.url || "",
              duration: t.music?.duration || 0,
              genre: t.music?.genre || "Unknown",
              coverArt: t.music?.coverArt || "/placeholder-logo.png",
            })),
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      alert("An error occurred while fetching playlists. Please try again.");
    }
  };

  const fetchAvailableTracks = async () => {
    try {
      const response = await fetch("/api/music/feed?limit=50&offset=0");
      const data = await response.json();
      if (data.success && Array.isArray(data.items)) {
        setAvailableTracks(
          data.items.map((item: any) => ({
            id: item.id.toString(),
            title: item.title,
            artist: item.artist,
            mp3Url: item.mp3Url || item.url,
            duration: item.duration || "--:--",
            genre: item.genre || "Unknown",
            coverArt: item.coverArt || "/placeholder-logo.png",
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching available tracks:", error);
      alert("An error occurred while fetching tracks. Please try again.");
    }
  };

  useEffect(() => {
    if (userId && !error) {
      fetchPlaylists();
      fetchAvailableTracks();
    }
  }, [userId, error]);

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("Please sign in to create a playlist.");
      return;
    }
    setIsCreating(true);
    try {
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newPlaylist.name,
          description: newPlaylist.description,
          trackIds: newPlaylist.trackIds,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to create playlist:", data.message);
        alert(`Error: ${data.message}`);
        return;
      }
      await fetchPlaylists();
      setNewPlaylist({ name: "", description: "", trackIds: [] });
    } catch (error) {
      console.error("Error creating playlist:", error);
      alert("An error occurred while creating the playlist. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleTrack = async (
    playlistId: string,
    trackId: string,
    isInPlaylist: boolean
  ) => {
    if (!userId) {
      alert("Please sign in to modify playlists.");
      return;
    }
    try {
      const response = await fetch(`/api/playlists/${playlistId}/tracks`, {
        method: isInPlaylist ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `Failed to ${isInPlaylist ? "remove" : "add"} track:`,
          errorData.message
        );
        alert(`Error: ${errorData.message}`);
        return;
      }
      await fetchPlaylists();
    } catch (error) {
      console.error("Error toggling track:", error);
      alert("An error occurred while updating the playlist. Please try again.");
    }
  };

  const handleSpotifyImport = () => {
    console.log("[v0] Spotify import initiated (placeholder)");
    alert(
      "Spotify playlist import would be implemented here. This would connect to Spotify API to import playlists."
    );
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    const playlistData = {
      id: playlist.id,
      name: playlist.name,
      description: playlist.description,
      tracks: playlist.trackList,
      coverArt: "/playlist-cover-chill-vibes.jpg",
      isPublic: false,
      createdBy: userId || "demo-user",
      totalDuration: playlist.trackList.reduce((sum, t) => sum + t.duration, 0),
      trackCount: playlist.trackList.length,
      followers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    actions.addPlaylist(playlistData);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (!userId) {
    return (
      <Card>
        <CardContent className="p-4 md:pt-6">
          <div className="text-center space-y-4">
            <Music className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg md:text-xl font-semibold">
                Please sign in
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Sign in to view and manage your playlists.
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/login";
                    },
                  },
                })
              }
            >
              Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          <DialogContent className="w-[95vw] max-w-md mx-auto max-h-[80vh] overflow-y-auto">
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
              <div className="space-y-2">
                <Label className="text-sm md:text-base">
                  Add Tracks (Optional)
                </Label>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2">
                  {availableTracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                      onClick={() => {
                        setNewPlaylist((prev) => ({
                          ...prev,
                          trackIds: prev.trackIds.includes(track.id)
                            ? prev.trackIds.filter((id) => id !== track.id)
                            : [...prev.trackIds, track.id],
                        }));
                      }}
                    >
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <Music className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {track.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {track.artist}
                        </p>
                      </div>
                      {newPlaylist.trackIds.includes(track.id) && (
                        <Check className="h-4 w-4 text-accent" />
                      )}
                    </div>
                  ))}
                </div>
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
