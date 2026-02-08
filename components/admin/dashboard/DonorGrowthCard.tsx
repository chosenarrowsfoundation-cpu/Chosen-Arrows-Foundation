'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DonorGrowthCardProps {
  uniqueDonors: number
  averageDonation: number
  monthlyTrend: number
}

export function DonorGrowthCard({ uniqueDonors, averageDonation, monthlyTrend }: DonorGrowthCardProps) {
  const isPositive = monthlyTrend >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown
  const trendColor = isPositive ? 'text-emerald-500' : 'text-rose-500'

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground font-medium mb-1">Unique Donors</p>
            <p className="text-3xl font-bold text-foreground">{uniqueDonors.toLocaleString()}</p>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground font-medium mb-1">Average Donation</p>
            <p className="text-2xl font-bold text-foreground">
              ${averageDonation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground font-medium">Monthly Trend</p>
              <div className="flex items-center gap-1">
                <TrendIcon className={cn('h-4 w-4', trendColor)} />
                <span className={cn('text-sm font-medium', trendColor)}>
                  {isPositive && '+'}
                  {monthlyTrend}%
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">vs previous month</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
