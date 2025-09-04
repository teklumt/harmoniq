import { type NextRequest, NextResponse } from "next/server"

const mockTracks = [
  { id: 1, title: "Midnight Dreams", artist: "Luna Eclipse", genre: "Electronic", duration: "3:45" },
  { id: 2, title: "Ocean Waves", artist: "Coastal Sounds", genre: "Ambient", duration: "4:12" },
  { id: 3, title: "City Lights", artist: "Urban Melody", genre: "Pop", duration: "3:28" },
  { id: 4, title: "Mountain High", artist: "Nature Sounds", genre: "Folk", duration: "4:05" },
  { id: 5, title: "Electric Pulse", artist: "Neon Waves", genre: "EDM", duration: "3:52" },
]

const mockArtists = [
  { id: 1, name: "Luna Eclipse", genre: "Electronic", tracks: 12 },
  { id: 2, name: "Coastal Sounds", genre: "Ambient", tracks: 8 },
  { id: 3, name: "Urban Melody", genre: "Pop", tracks: 15 },
]

const mockAlbums = [
  { id: 1, title: "Night Sessions", artist: "Luna Eclipse", year: 2024, tracks: 10 },
  { id: 2, title: "Ocean Dreams", artist: "Coastal Sounds", year: 2023, tracks: 8 },
  { id: 3, title: "City Stories", artist: "Urban Melody", year: 2024, tracks: 12 },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "all"

    console.log("[v0] Music search request:", {
      query,
      type,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    })

    if (!query) {
      return NextResponse.json({ success: false, message: "Query parameter is required" }, { status: 400 })
    }

    // Simulate search logic
    const results = {
      tracks: mockTracks.filter(
        (track) =>
          track.title.toLowerCase().includes(query.toLowerCase()) ||
          track.artist.toLowerCase().includes(query.toLowerCase()),
      ),
      artists: mockArtists.filter((artist) => artist.name.toLowerCase().includes(query.toLowerCase())),
      albums: mockAlbums.filter(
        (album) =>
          album.title.toLowerCase().includes(query.toLowerCase()) ||
          album.artist.toLowerCase().includes(query.toLowerCase()),
      ),
    }

    console.log("[v0] Search results:", {
      query,
      tracksFound: results.tracks.length,
      artistsFound: results.artists.length,
      albumsFound: results.albums.length,
    })

    return NextResponse.json({
      success: true,
      results: type === "all" ? results : { [type]: results[type as keyof typeof results] },
      query,
    })
  } catch (error) {
    console.error("[v0] Music search error:", error)

    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
