import { type NextRequest, NextResponse } from "next/server"

// Mock favorites storage (in real app, this would be in database)
let mockFavorites = [
  { id: 1, userId: "user_1", trackId: "track_1", addedAt: new Date().toISOString() },
  { id: 2, userId: "user_1", trackId: "track_2", addedAt: new Date().toISOString() },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user_1" // Mock user ID

    console.log("[v0] Get favorites request:", {
      userId,
      timestamp: new Date().toISOString(),
    })

    const userFavorites = mockFavorites.filter((fav) => fav.userId === userId)

    return NextResponse.json({
      success: true,
      favorites: userFavorites,
      count: userFavorites.length,
    })
  } catch (error) {
    console.error("[v0] Get favorites error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { trackId, userId = "user_1" } = body

    console.log("[v0] Add favorite request:", {
      trackId,
      userId,
      timestamp: new Date().toISOString(),
    })

    // Check if already favorited
    const existing = mockFavorites.find((fav) => fav.userId === userId && fav.trackId === trackId)
    if (existing) {
      return NextResponse.json({ success: false, message: "Track already in favorites" }, { status: 400 })
    }

    const newFavorite = {
      id: mockFavorites.length + 1,
      userId,
      trackId,
      addedAt: new Date().toISOString(),
    }

    mockFavorites.push(newFavorite)

    console.log("[v0] Favorite added:", newFavorite)

    return NextResponse.json({
      success: true,
      favorite: newFavorite,
      message: "Track added to favorites",
    })
  } catch (error) {
    console.error("[v0] Add favorite error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const trackId = searchParams.get("trackId")
    const userId = searchParams.get("userId") || "user_1"

    console.log("[v0] Remove favorite request:", {
      trackId,
      userId,
      timestamp: new Date().toISOString(),
    })

    const initialLength = mockFavorites.length
    mockFavorites = mockFavorites.filter((fav) => !(fav.userId === userId && fav.trackId === trackId))

    if (mockFavorites.length === initialLength) {
      return NextResponse.json({ success: false, message: "Favorite not found" }, { status: 404 })
    }

    console.log("[v0] Favorite removed:", { trackId, userId })

    return NextResponse.json({
      success: true,
      message: "Track removed from favorites",
    })
  } catch (error) {
    console.error("[v0] Remove favorite error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
