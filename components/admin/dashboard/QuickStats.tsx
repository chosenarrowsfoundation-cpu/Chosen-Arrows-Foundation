'use client'

import { cn } from '@/lib/utils'

export interface StatItem {
  metricName: string
  value: number
  maxValue?: number
  color?: 'primary' | 'success' | 'warning' | 'info' | 'danger'
  suffix?: string
  prefix?: string
}

interface QuickStatsProps {
  title?: string
  stats: StatItem[]
  className?: string
}

const colorConfig = {
  primary: { bar: 'bg-primary', text: 'text-primary' },
  success: { bar: 'bg-emerald-500', text: 'text-emerald-500' },
  warning: { bar: 'bg-amber-500', text: 'text-amber-500' },
  info: { bar: 'bg-blue-500', text: 'text-blue-500' },
  danger: { bar: 'bg-rose-500', text: 'text-rose-500' },
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function QuickStats({ 
  title = 'Quick Stats', 
  stats, 
  className 
}: QuickStatsProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {stats.map((stat, index) => {
          const config = colorConfig[stat.color || 'primary']
          const percentage = stat.maxValue 
            ? Math.min((stat.value / stat.maxValue) * 100, 100) 
            : stat.value

          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {stat.metricName}
                </span>
                <span className={cn('text-sm font-semibold', config.text)}>
                  {stat.prefix}
                  {typeof stat.value === 'number' 
                    ? stat.value.toLocaleString(undefined, { maximumFractionDigits: 1 }) 
                    : stat.value}
                  {stat.suffix}
                </span>
              </div>

              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn('h-full rounded-full', config.bar)}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
