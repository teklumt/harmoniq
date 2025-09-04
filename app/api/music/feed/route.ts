import { type NextRequest, NextResponse } from "next/server"

const mockFeedItems = [
  {
    id: 1,
    title: "Summer Vibes",
    artist: "Tropical Beats",
    genre: "Electronic",
    duration: "4:23",
    uploadedBy: "DJ Sunshine",
    uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 2,
    title: "Acoustic Journey",
    artist: "Mountain Folk",
    genre: "Folk",
    duration: "3:45",
    uploadedBy: "Sarah Chen",
    uploadedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
  },
  {
    id: 3,
    title: "Bass Drop",
    artist: "Electronic Fusion",
    genre: "EDM",
    duration: "5:12",
    uploadedBy: "BeatMaster",
    uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 4,
    title: "Midnight Jazz",
    artist: "Smooth Operators",
    genre: "Jazz",
    duration: "6:34",
    uploadedBy: "Jazz Lover",
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    console.log("[v0] Music feed request:", {
      limit,
      offset,
      timestamp: new Date().toISOString(),
    })

    const paginatedItems = mockFeedItems.slice(offset, offset + limit)

    console.log("[v0] Music feed response:", {
      itemsReturned: paginatedItems.length,
      totalItems: mockFeedItems.length,
    })

    return NextResponse.json({
      success: true,
      items: paginatedItems,
      pagination: {
        limit,
        offset,
        total: mockFeedItems.length,
        hasMore: offset + limit < mockFeedItems.length,
      },
    })
  } catch (error) {
    console.error("[v0] Music feed error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
