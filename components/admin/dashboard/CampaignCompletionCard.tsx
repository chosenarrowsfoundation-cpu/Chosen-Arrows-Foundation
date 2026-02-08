'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Target } from 'lucide-react'

interface CampaignCompletionCardProps {
  completionRate: number
  overallProgress: number
  activeCampaigns: number
}

export function CampaignCompletionCard({ 
  completionRate, 
  overallProgress, 
  activeCampaigns 
}: CampaignCompletionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Campaign Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm font-semibold text-primary">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        {/* Completion Rate */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">Completion Rate</span>
            </div>
            <span className="text-sm font-semibold text-emerald-500">{completionRate}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            {activeCampaigns} active campaigns
          </p>
        </div>

        {/* Active Campaigns Count */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Active Campaigns</p>
              <p className="text-2xl font-bold text-foreground mt-1">{activeCampaigns}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
