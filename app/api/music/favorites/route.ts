import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "20");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        music: {
          include: {
            uploadedBy: { select: { name: true, id: true } },
          },
        },
      },
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    const total = await prisma.favorite.count({ where: { userId } });

    const items = favorites.map((fav) => ({
      id: fav.music.id,
      title: fav.music.title,
      artist: fav.music.author,
      genre: fav.music.genre,
      mp3Url: fav.music.url,
      uploadedBy: fav.music.uploadedBy?.name || "Unknown",
      uploadedById: fav.music.uploadedBy?.id,
      addedAt: fav.createdAt,
      duration: "--:--", // Add actual duration calculation if available in Music model
      coverArt: "/placeholder-logo.png", // Replace with actual cover art if available
    }));

    return NextResponse.json({
      success: true,
      items,
      count: favorites.length,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("[v0] Get favorites error:", error);
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
    const { trackId } = body;

    if (!trackId) {
      return NextResponse.json(
        { success: false, message: "Track ID is required" },
        { status: 400 }
      );
    }

    // Check if track exists
    const track = await prisma.music.findUnique({ where: { id: trackId } });
    if (!track) {
      return NextResponse.json(
        { success: false, message: "Track not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: { userId_musicId: { userId, musicId: trackId } },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Track already in favorites" },
        { status: 400 }
      );
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        musicId: trackId,
      },
      include: {
        music: {
          include: {
            uploadedBy: { select: { name: true, id: true } },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      favorite: {
        id: favorite.music.id,
        title: favorite.music.title,
        artist: favorite.music.author,
        genre: favorite.music.genre,
        mp3Url: favorite.music.url,
        uploadedBy: favorite.music.uploadedBy?.name || "Unknown",
        uploadedById: favorite.music.uploadedBy?.id,
        addedAt: favorite.createdAt,
        duration: "--:--",
        coverArt: "/placeholder-logo.png",
      },
      message: "Track added to favorites",
    });
  } catch (error) {
    console.error("[v0] Add favorite error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get("trackId");

    const session = await auth.api.getSession({ headers: await headers() });
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    if (!trackId) {
      return NextResponse.json(
        { success: false, message: "Track ID is required" },
        { status: 400 }
      );
    }

    const result = await prisma.favorite.deleteMany({
      where: {
        userId,
        musicId: trackId,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "Favorite not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Track removed from favorites",
    });
  } catch (error) {
    console.error("[v0] Remove favorite error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}