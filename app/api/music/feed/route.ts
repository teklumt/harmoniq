import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const offset = Number.parseInt(searchParams.get("offset") || "0");

    // Fetch music from DB
    const musics = await prisma.music.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { name: true, id: true } },
      },
    });
    const total = await prisma.music.count();

    // Format response
    const items = musics.map((music: any) => ({
      id: music.id,
      title: music.title,
      artist: music.author,
      genre: music.genre,
      mp3Url: music.url,
      uploadedBy: music.uploadedBy?.name || "Unknown",
      uploadedById: music.uploadedBy?.id,
      uploadedAt: music.createdAt,
    }));

    return NextResponse.json({
      success: true,
      items,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error("[v0] Music feed error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
