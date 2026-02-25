'use client'

import { useEffect, useState } from 'react'
import { 
  RefreshCw, 
  Plus, 
  DollarSign,
  Users,
  Flag,
  Target,
  LayoutDashboard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getDashboardStats, type DashboardStats } from '@/app/actions/dashboard/get-dashboard-stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

// Inline Separator
const Separator = ({ className, ...props }: { className?: string }) => (
  <div className={cn("h-[1px] w-full bg-border", className)} {...props} />
)

const POLL_INTERVAL = 45000

interface DashboardClientProps {
  initialStats: DashboardStats | null
}

export function DashboardClient({ initialStats }: DashboardClientProps) {
  const [stats, setStats] = useState<DashboardStats | null>(initialStats)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const newStats = await getDashboardStats()
      if (newStats) {
        setStats(newStats)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error refreshing dashboard:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    const interval = setInterval(refreshData, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Compact Header */}
      <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Overview</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">Updated {formatDistanceToNow(lastUpdated)} ago</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={refreshData} disabled={isRefreshing} className="h-8 w-8">
            <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
          </Button>
          <Link href="/admin/campaigns/new">
            <Button size="sm" className="h-8 gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* High-Level Metrics - Compact Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Raised</span>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">${stats.totalDonations.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span className={stats.monthlyDonationTrend >= 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
                {stats.monthlyDonationTrend > 0 ? "+" : ""}{stats.monthlyDonationTrend}%
              </span>
              <span>vs last month</span>
            </div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Active Campaigns</span>
            <Flag className="h-4 w-4 text-amber-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {stats.childrenNeedingSponsorship.length} need sponsorship
            </div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Donors</span>
            <Users className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{stats.uniqueDonors.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">
              ${stats.averageDonation.toLocaleString(undefined, { maximumFractionDigits: 0 })} avg. donation
            </div>
          </div>
        </Card>

        <Card className="p-4 flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Completion</span>
            <Target className="h-4 w-4 text-violet-600" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">{stats.campaignCompletionRate}%</div>
            <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-violet-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${stats.campaignCompletionRate}%` }} 
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Donations – full width */}
      <Card className="shadow-sm">
        <CardHeader className="py-3 px-4 border-b bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Recent Donations
            </CardTitle>
            <Link href="/admin/dashboard" className="text-xs text-primary hover:underline">
              View All
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {stats.recentDonations.length > 0 ? (
            <div className="divide-y max-h-[400px] overflow-y-auto">
              {stats.recentDonations.map((donation) => (
                <div key={donation.id} className="p-3 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{donation.donor_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{donation.campaign_title || 'General Donation'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-emerald-600">${donation.amount.toLocaleString()}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground min-h-[400px] flex items-center justify-center">
              No donations found yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
