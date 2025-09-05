import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({ headers: headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const playlistId = params.id;
    const body = await request.json();
    const { trackId }: { trackId: string } = body;

    console.log("[v0] Add track to playlist request:", {
      playlistId,
      trackId,
      userId,
      timestamp: new Date().toISOString(),
    });

    if (!trackId) {
      return NextResponse.json(
        { success: false, message: "Track ID is required" },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.findFirst({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      return NextResponse.json(
        { success: false, message: "Playlist not found or you don't have access" },
        { status: 404 }
      );
    }

    const track = await prisma.music.findUnique({ where: { id: trackId } });
    if (!track) {
      return NextResponse.json(
        { success: false, message: "Track not found" },
        { status: 404 }
      );
    }

    const existing = await prisma.playlistTrack.findUnique({
      where: { playlistId_musicId: { playlistId, musicId: trackId } },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Track already in playlist" },
        { status: 400 }
      );
    }

    const trackCount = await prisma.playlistTrack.count({
      where: { playlistId },
    });

    const playlistTrack = await prisma.playlistTrack.create({
      data: {
        playlistId,
        musicId: trackId,
        order: trackCount,
      },
      include: {
        music: true,
      },
    });

    return NextResponse.json({
      success: true,
      track: {
        id: playlistTrack.music.id,
        title: playlistTrack.music.title,
        artist: playlistTrack.music.author,
        mp3Url: playlistTrack.music.url,
        genre: playlistTrack.music.genre || "Unknown",
      },
      message: "Track added to playlist",
    });
  } catch (error) {
    console.error("[v0] Add track to playlist error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({ headers: headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const playlistId = params.id;
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get("trackId");

    console.log("[v0] Remove track from playlist request:", {
      playlistId,
      trackId,
      userId,
      timestamp: new Date().toISOString(),
    });

    if (!trackId) {
      return NextResponse.json(
        { success: false, message: "Track ID is required" },
        { status: 400 }
      );
    }

    const playlist = await prisma.playlist.findFirst({
      where: { id: playlistId, userId },
    });

    if (!playlist) {
      return NextResponse.json(
        { success: false, message: "Playlist not found or you don't have access" },
        { status: 404 }
      );
    }

    const result = await prisma.playlistTrack.deleteMany({
      where: {
        playlistId,
        musicId: trackId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "Track not found in playlist" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Track removed from playlist",
    });
  } catch (error) {
    console.error("[v0] Remove track from playlist error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}