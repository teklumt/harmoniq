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

    console.log("[v0] Get playlist request:", {
      playlistId,
      timestamp: new Date().toISOString(),
    })

    const playlist = mockPlaylists.find((p) => p.id === playlistId)

    if (!playlist) {
      return NextResponse.json({ success: false, message: "Playlist not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      playlist,
    })
  } catch (error) {
    console.error("[v0] Get playlist error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playlistId = Number.parseInt(params.id)
    const body = await request.json()
    const { name, description } = body

    console.log("[v0] Update playlist request:", {
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

    console.log("[v0] Playlist updated:", mockPlaylists[playlistIndex])

    return NextResponse.json({
      success: true,
      playlist: mockPlaylists[playlistIndex],
      message: "Playlist updated successfully",
    })
  } catch (error) {
    console.error("[v0] Update playlist error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const playlistId = Number.parseInt(params.id)

    console.log("[v0] Delete playlist request:", {
      playlistId,
      timestamp: new Date().toISOString(),
    })

    const initialLength = mockPlaylists.length
    mockPlaylists = mockPlaylists.filter((p) => p.id !== playlistId)

    if (mockPlaylists.length === initialLength) {
      return NextResponse.json({ success: false, message: "Playlist not found" }, { status: 404 })
    }

    console.log("[v0] Playlist deleted:", { playlistId })

    return NextResponse.json({
      success: true,
      message: "Playlist deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Delete playlist error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
