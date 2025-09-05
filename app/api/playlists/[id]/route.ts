import { type NextRequest, NextResponse } from "next/server"

// Mock playlists storage (shared with main playlists route)
let mockPlaylists = [
  {
    id: 1,
    name: "Chill Vibes",
    description: "Relaxing music for work",
    userId: "user_1",
    tracks: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Workout Mix",
    description: "High energy tracks",
    userId: "user_1",
    tracks: [],
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playlistId = Number.parseInt(params.id)

    console.log(" " " Get playlist request:", {
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
      return NextResponse.json({ success: false, message: "Playlist not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      playlist,
    })
  } catch (error) {
    console.error(" " " Get playlist error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playlistId = Number.parseInt(params.id)
    const body = await request.json()
    const { name, description } = body

    console.log(" " " Update playlist request:", {
      playlistId,
      name,
      description,
      timestamp: new Date().toISOString(),
    })

    const playlistIndex = mockPlaylists.findIndex((p) => p.id === playlistId)

    if (playlistIndex === -1) {
      return NextResponse.json({ success: false, message: "Playlist not found" }, { status: 404 })
    }

    if (name) mockPlaylists[playlistIndex].name = name
    if (description !== undefined) mockPlaylists[playlistIndex].description = description

    console.log(" " " Playlist updated:", mockPlaylists[playlistIndex])

    return NextResponse.json({
      success: true,
      track: {
        id: playlistTrack.music.id,
        title: playlistTrack.music.title,
        artist: playlistTrack.music.author,
        mp3Url: playlistTrack.music.url,
        duration: 0,
        genre: playlistTrack.music.genre || "Unknown",
        coverArt: "/placeholder-logo.png",
      },
      message: "Track added to playlist",
    });
  } catch (error) {
    console.error(" " " Update playlist error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
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

    console.log(" " " Delete playlist request:", {
      playlistId,
      trackId,
      userId,
      timestamp: new Date().toISOString(),
    })

    const initialLength = mockPlaylists.length
    mockPlaylists = mockPlaylists.filter((p) => p.id !== playlistId)

    if (mockPlaylists.length === initialLength) {
      return NextResponse.json({ success: false, message: "Playlist not found" }, { status: 404 })
    }

    console.log(" " " Playlist deleted:", { playlistId })

    return NextResponse.json({
      success: true,
      message: "Track removed from playlist",
    });
  } catch (error) {
    console.error(" " " Delete playlist error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
