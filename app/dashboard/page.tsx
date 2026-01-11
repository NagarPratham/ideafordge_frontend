import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Navbar } from "@/components/landing/navbar"

export default function DashboardPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16 sm:pt-20 md:pt-24">
        <DashboardContent />
      </div>
    </main>
  )
}
