import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get("title") as string
    const artist = formData.get("artist") as string
    const genre = formData.get("genre") as string
    const description = formData.get("description") as string
    const file = formData.get("file") as File

    // Log the upload attempt
    console.log("[v0] Music upload attempt:", {
      title,
      artist,
      genre,
      description,
      fileName: file?.name,
      fileSize: file?.size,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent"),
    })

    // Simulate file processing
    if (file && title && artist) {
      const mockTrack = {
        id: "track_" + Date.now(),
        title,
        artist,
        genre,
        description,
        url: `https://mock-storage.com/${file.name}`,
        duration: "3:45", // Mock duration
        uploadedAt: new Date().toISOString(),
      }

      console.log("[v0] Music upload successful:", mockTrack)

      return NextResponse.json({
        success: true,
        track: mockTrack,
        message: "Track uploaded successfully",
      })
    } else {
      console.log("[v0] Music upload failed: Missing required fields")

      return NextResponse.json(
        { success: false, message: "Missing required fields: title, artist, and file" },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("[v0] Music upload error:", error)

    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
