import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { UploadForm } from "@/components/dashboard/upload-form"

export default function UploadPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-balance">Upload Music</h1>
          <p className="text-muted-foreground">Share your music with the world</p>
        </div>

        <UploadForm />
      </div>
    </DashboardLayout>
  )
}
