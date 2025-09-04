import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Music } from "lucide-react"

const recentSongs = [
  { id: 1, title: "Midnight Dreams", artist: "Luna Eclipse", duration: "3:45" },
  { id: 2, title: "Electric Pulse", artist: "Neon Waves", duration: "4:12" },
  { id: 3, title: "Ocean Breeze", artist: "Coastal Sounds", duration: "3:28" },
  { id: 4, title: "City Lights", artist: "Urban Melody", duration: "3:56" },
]

export function RecentlyPlayed() {
  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg md:text-xl">Recently Played</CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <div className="space-y-2 md:space-y-3">
          {recentSongs.map((song) => (
            <div
              key={song.id}
              className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-muted rounded-md flex items-center justify-center shrink-0">
                <Music className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium truncate text-sm md:text-base">{song.title}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">{song.artist}</p>
                <span className="text-xs text-muted-foreground sm:hidden">{song.duration}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs md:text-sm text-muted-foreground hidden sm:block">{song.duration}</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 md:h-9 md:w-9 p-0">
                  <Play className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
