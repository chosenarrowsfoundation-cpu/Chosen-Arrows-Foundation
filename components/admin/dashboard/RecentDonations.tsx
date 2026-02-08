'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface RecentDonation {
  id: string
  donor_name: string
  amount: number
  created_at: string
  campaign_title: string | null
}

interface RecentDonationsProps {
  donations: RecentDonation[]
  viewAllHref?: string
}

export function RecentDonations({ donations, viewAllHref = '/admin/dashboard' }: RecentDonationsProps) {
  const isNested = !viewAllHref

  const content = (
    <div className="space-y-3">
      {donations.length > 0 ? (
        donations.slice(0, 8).map((donation) => (
          <div
            key={donation.id}
            className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 hover:border-primary/20 transition-all group"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <DollarSign className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {donation.donor_name}
                </p>
                {donation.campaign_title && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {donation.campaign_title}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ${donation.amount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No recent donations</p>
        </div>
      )}
    </div>
  )

  if (isNested) {
    return <div className="w-full">{content}</div>
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Recent Donations</CardTitle>
        {viewAllHref && (
          <Link href={viewAllHref}>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-8">
              View all
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  )
}
