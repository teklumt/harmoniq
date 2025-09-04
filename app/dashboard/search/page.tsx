import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SearchInterface } from "@/components/dashboard/search-interface"

export default function SearchPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Search Music</h1>
          <p className="text-muted-foreground">Find your favorite songs, artists, and albums</p>
        </div>

        <SearchInterface />
      </div>
    </DashboardLayout>
  )
}
