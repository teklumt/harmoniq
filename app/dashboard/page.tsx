import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { MusicFeed } from "@/components/dashboard/music-feed"
import { RecentlyPlayed } from "@/components/dashboard/recently-played"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-balance">Welcome back</h1>
          <p className="text-muted-foreground text-sm md:text-base">Discover new music and manage your collection</p>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recently Played */}
          <RecentlyPlayed />

          {/* Music Feed */}
          <MusicFeed />
        </div>
      </div>
    </DashboardLayout>
  )
}
