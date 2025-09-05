import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    console.log("[v0] Get playlists request:", {
      userId,
      timestamp: new Date().toISOString(),
    });

    const playlists = await prisma.playlist.findMany({
      where: { userId },
      include: {
        tracks: {
          include: {
            music: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      playlists: playlists.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description || "",
        userId: p.userId,
        tracks: p.tracks.map((t) => ({
          id: t.music.id,
          title: t.music.title,
          artist: t.music.author,
          mp3Url: t.music.url,
          duration: t.music.duration || 0,
          genre: t.music.genre || "Unknown",
          coverArt: t.music.coverArt || "/placeholder-logo.png",
        })),
        createdAt: p.createdAt,
      })),
      count: playlists.length,
    });
  } catch (error) {
    console.error("[v0] Get playlists error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, trackIds = [] } = body;

    console.log("[v0] Create playlist request:", {
      name,
      description,
      userId,
      trackIds,
      timestamp: new Date().toISOString(),
    });

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Playlist name is required" },
        { status: 400 }
      );
    }

    // Validate trackIds
    if (trackIds.length > 0) {
      const tracks = await prisma.music.findMany({
        where: { id: { in: trackIds } },
      });
      if (tracks.length !== trackIds.length) {
        return NextResponse.json(
          { success: false, message: "One or more tracks not found" },
          { status: 404 }
        );
      }
    }

    const playlist = await prisma.playlist.create({
      data: {
        name,
        description: description || "",
        userId,
        tracks: {
          create: trackIds.map((trackId: string, index: number) => ({
            musicId: trackId,
            order: index,
          })),
        },
      },
      include: {
        tracks: {
          include: {
            music: true,
          },
        },
      },
    });

    console.log("[v0] Playlist created:", playlist);

    return NextResponse.json({
      success: true,
      playlist: {
        id: playlist.id,
        name: playlist.name,
        description: "",
        userId: playlist.userId,
        tracks: playlist.tracks.map((t) => ({
          id: t.music.id,
          title: t.music.title,
          artist: t.music.author,
          mp3Url: t.music.url,
          duration: t.music.duration || 0,
          genre: t.music.genre || "Unknown",
          coverArt: t.music.coverArt || "/placeholder-logo.png",
        })),
        createdAt: playlist.createdAt,
      },
      message: "Playlist created successfully",
    });
  } catch (error) {
    console.error("[v0] Create playlist error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}