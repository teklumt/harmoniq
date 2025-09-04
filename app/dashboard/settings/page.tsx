import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { SettingsInterface } from "@/components/dashboard/settings-interface"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-balance">Settings</h1>
          <p className="text-muted-foreground text-sm md:text-base">Manage your account preferences and app settings</p>
        </div>

        <SettingsInterface />
      </div>
    </DashboardLayout>
  )
}
