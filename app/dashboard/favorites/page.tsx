import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { FavoritesList } from "@/components/dashboard/favorites-list"

export default function FavoritesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Your Favorites</h1>
          <p className="text-muted-foreground">All the songs you've liked in one place</p>
        </div>

        <FavoritesList />
      </div>
    </DashboardLayout>
  )
}
