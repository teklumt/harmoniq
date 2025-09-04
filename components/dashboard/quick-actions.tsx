import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Search, ListMusic, Heart } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    /* Improved responsive grid with better breakpoints */
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6 text-center">
          <Button variant="ghost" size="lg" className="h-auto flex-col gap-2 w-full p-2 md:p-3" asChild>
            <Link href="/dashboard/upload">
              <div className="p-2 md:p-3 bg-accent/10 rounded-full">
                <Upload className="h-5 w-5 md:h-6 md:w-6 text-accent" />
              </div>
              <span className="font-medium text-xs md:text-sm">Upload Music</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6 text-center">
          <Button variant="ghost" size="lg" className="h-auto flex-col gap-2 w-full p-2 md:p-3" asChild>
            <Link href="/dashboard/search">
              <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                <Search className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <span className="font-medium text-xs md:text-sm">Search Music</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6 text-center">
          <Button variant="ghost" size="lg" className="h-auto flex-col gap-2 w-full p-2 md:p-3" asChild>
            <Link href="/dashboard/playlists">
              <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                <ListMusic className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <span className="font-medium text-xs md:text-sm">My Playlists</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6 text-center">
          <Button variant="ghost" size="lg" className="h-auto flex-col gap-2 w-full p-2 md:p-3" asChild>
            <Link href="/dashboard/favorites">
              <div className="p-2 md:p-3 bg-accent/10 rounded-full">
                <Heart className="h-5 w-5 md:h-6 md:w-6 text-accent" />
              </div>
              <span className="font-medium text-xs md:text-sm">Favorites</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
