import { Suspense } from 'react'
import { DashboardClient } from '@/components/admin/dashboard'
import { getDashboardStats } from '@/app/actions/dashboard/get-dashboard-stats'
import { Loader2 } from 'lucide-react'

export default async function AdminDashboardPage() {
  // Fetch initial dashboard stats using optimized function
  const initialStats = await getDashboardStats()

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <DashboardClient initialStats={initialStats} />
    </Suspense>
  )
}
