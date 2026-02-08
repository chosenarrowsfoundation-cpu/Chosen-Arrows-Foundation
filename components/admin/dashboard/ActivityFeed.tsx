'use client'

import { cn } from '@/lib/utils'
import { 
  DollarSign, 
  UserPlus, 
  Package, 
  Wrench, 
  Bell,
  FileText,
  Flag,
  Image as ImageIcon,
  Settings,
  LucideIcon
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDistanceToNow } from 'date-fns'

export type ActivityEventType = 
  | 'sale' 
  | 'user_registered' 
  | 'product_updated' 
  | 'maintenance' 
  | 'notification'
  | 'campaign_created'
  | 'campaign_updated'
  | 'content_updated'
  | 'media_uploaded'
  | 'settings_changed'

export interface ActivityItem {
  id: string
  eventType: ActivityEventType
  entityType?: string
  entityId?: string
  summary: string
  description?: string
  timestamp: Date | string
  actor?: string
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  viewAllHref?: string
  className?: string
  maxItems?: number
}

const eventConfig: Record<ActivityEventType, { icon: LucideIcon; color: string; bgColor: string }> = {
  sale: { icon: DollarSign, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  user_registered: { icon: UserPlus, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  product_updated: { icon: Package, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
  maintenance: { icon: Wrench, color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  notification: { icon: Bell, color: 'text-rose-500', bgColor: 'bg-rose-500/10' },
  campaign_created: { icon: Flag, color: 'text-primary', bgColor: 'bg-primary/10' },
  campaign_updated: { icon: Flag, color: 'text-violet-500', bgColor: 'bg-violet-500/10' },
  content_updated: { icon: FileText, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
  media_uploaded: { icon: ImageIcon, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
  settings_changed: { icon: Settings, color: 'text-slate-500', bgColor: 'bg-slate-500/10' },
}

function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
  return formatDistanceToNow(date, { addSuffix: true })
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ActivityFeed({ 
  activities, 
  viewAllHref = '/admin/audit',
  className,
  maxItems = 5 
}: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems)
  const isNested = className?.includes('border-0') || className?.includes('shadow-none')

  const content = (
    <div className="space-y-3">
      {displayedActivities.length > 0 ? (
        displayedActivities.map((activity) => {
          const config = eventConfig[activity.eventType] || eventConfig.notification
          const Icon = config.icon

          return (
            <div 
              key={activity.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
            >
              <div className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                config.bgColor
              )}>
                <Icon className={cn('h-4 w-4', config.color)} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {activity.summary}
                </p>
                {activity.description && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {activity.description}
                  </p>
                )}
              </div>

              <span className="text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                {formatTimestamp(activity.timestamp)}
              </span>
            </div>
          )
        })
      ) : (
        <div className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </div>
      )}
    </div>
  )

  if (isNested) {
    return <div className={cn('w-full', className)}>{content}</div>
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
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
