import { type NextRequest, NextResponse } from "next/server"

// Mock playlists storage
const mockPlaylists = [
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user_1"

    console.log("[v0] Get playlists request:", {
      userId,
      timestamp: new Date().toISOString(),
    })

    const userPlaylists = mockPlaylists.filter((playlist) => playlist.userId === userId)

    return NextResponse.json({
      success: true,
      playlists: userPlaylists,
      count: userPlaylists.length,
    })
  } catch (error) {
    console.error("[v0] Get playlists error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, userId = "user_1" } = body

    console.log("[v0] Create playlist request:", {
      name,
      description,
      userId,
      timestamp: new Date().toISOString(),
    })

    if (!name) {
      return NextResponse.json({ success: false, message: "Playlist name is required" }, { status: 400 })
    }

    const newPlaylist = {
      id: mockPlaylists.length + 1,
      name,
      description: description || "",
      userId,
      tracks: [],
      createdAt: new Date().toISOString(),
    }

    mockPlaylists.push(newPlaylist)

    console.log("[v0] Playlist created:", newPlaylist)

    return NextResponse.json({
      success: true,
      playlist: newPlaylist,
      message: "Playlist created successfully",
    })
  } catch (error) {
    console.error("[v0] Create playlist error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
