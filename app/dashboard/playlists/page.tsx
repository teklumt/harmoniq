import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PlaylistGrid } from "@/components/dashboard/playlist-grid"

export default function PlaylistsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Your Playlists</h1>
          <p className="text-muted-foreground">Organize and manage your music collections</p>
        </div>

        <PlaylistGrid />
      </div>
    </DashboardLayout>
  )
}
