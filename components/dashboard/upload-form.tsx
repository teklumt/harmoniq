"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Music, CheckCircle } from "lucide-react"

const genres = [
  "Pop",
  "Rock",
  "Hip Hop",
  "Electronic",
  "Jazz",
  "Classical",
  "Country",
  "R&B",
  "Folk",
  "Reggae",
  "Blues",
  "Alternative",
]

export function UploadForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    description: "",
    file: null as File | null,
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, file })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)

    try {
      // Simulate file upload
      console.log("[v0] Uploading music:", {
        title: formData.title,
        artist: formData.artist,
        genre: formData.genre,
        description: formData.description,
        fileName: formData.file?.name,
        fileSize: formData.file?.size,
        timestamp: new Date().toISOString(),
      })

      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("[v0] Music upload successful")
      setIsUploaded(true)
    } catch (error) {
      console.error("[v0] Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  if (isUploaded) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-4 md:pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 md:h-16 md:w-16 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl md:text-2xl font-semibold">Upload Successful!</h3>
              <p className="text-muted-foreground text-sm md:text-base">
                Your music has been uploaded and is now available to stream.
              </p>
            </div>
            <Button onClick={() => setIsUploaded(false)} variant="outline" className="w-full sm:w-auto">
              Upload Another Track
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Upload Your Music</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm md:text-base">
              Music File
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 md:p-8 text-center hover:border-primary/50 transition-colors">
              <input id="file" type="file" accept="audio/*" onChange={handleFileChange} className="hidden" required />
              <label htmlFor="file" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  {formData.file ? (
                    <>
                      <Music className="h-8 w-8 md:h-12 md:w-12 text-primary" />
                      <p className="font-medium text-sm md:text-base">{formData.file.name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground" />
                      <p className="font-medium text-sm md:text-base">Click to upload your music file</p>
                      <p className="text-xs md:text-sm text-muted-foreground">Supports MP3, WAV, FLAC files</p>
                    </>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Track Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm md:text-base">
                Track Title
              </Label>
              <Input
                id="title"
                placeholder="Enter track title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="text-sm md:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artist" className="text-sm md:text-base">
                Artist Name
              </Label>
              <Input
                id="artist"
                placeholder="Enter artist name"
                value={formData.artist}
                onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                required
                className="text-sm md:text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre" className="text-sm md:text-base">
              Genre
            </Label>
            <Select value={formData.genre} onValueChange={(value) => setFormData({ ...formData, genre: value })}>
              <SelectTrigger className="text-sm md:text-base">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre} className="text-sm md:text-base">
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm md:text-base">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              placeholder="Tell us about your track..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="text-sm md:text-base resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full text-sm md:text-base h-10 md:h-11"
            disabled={isUploading || !formData.file}
          >
            {isUploading ? "Uploading..." : "Upload Track"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
