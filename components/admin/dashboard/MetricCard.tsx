'use client'

import { cn } from '@/lib/utils'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  Flag,
  FileText,
  Layers,
} from 'lucide-react'

const iconMap = {
  'dollar-sign': DollarSign,
  'users': Users,
  'flag': Flag,
  'file-text': FileText,
  'layers': Layers,
} as const

export type MetricIconName = keyof typeof iconMap

const colorPresets = {
  emerald: {
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-500',
  },
  blue: {
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
  },
  amber: {
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
  },
  violet: {
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-500',
  },
  primary: {
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
  },
} as const

export type IconColorPreset = keyof typeof colorPresets

export interface MetricCardProps {
  metricName: string
  currentValue: string | number
  percentageChange?: number
  timeReference?: string
  icon?: MetricIconName
  colorPreset?: IconColorPreset
  className?: string
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MetricCard({
  metricName,
  currentValue,
  percentageChange,
  timeReference = 'from last month',
  icon,
  colorPreset = 'primary',
  className,
}: MetricCardProps) {
  const isPositive = percentageChange !== undefined && percentageChange > 0
  const isNegative = percentageChange !== undefined && percentageChange < 0

  const TrendIcon = isPositive ? TrendingUp : TrendingDown
  const trendColor = isPositive ? 'text-emerald-500' : 'text-rose-500'

  const IconComponent = icon ? iconMap[icon] : null
  const colors = colorPresets[colorPreset]

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {IconComponent && (
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              colors.iconBg
            )}>
              <IconComponent className={cn('h-5 w-5', colors.iconColor)} />
            </div>
          )}
          
          {percentageChange !== undefined && percentageChange !== 0 && (
            <div className="flex items-center gap-1">
              <TrendIcon className={cn('h-4 w-4', trendColor)} />
              <span className={cn('text-sm font-medium', trendColor)}>
                {isPositive && '+'}
                {percentageChange}%
              </span>
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-muted-foreground font-medium">
          {metricName}
        </p>

        <p className="mt-1 text-2xl font-bold text-foreground">
          {typeof currentValue === 'number' 
            ? currentValue.toLocaleString() 
            : currentValue}
        </p>

        {percentageChange !== undefined && (
          <p className="mt-1 text-xs text-muted-foreground">
            {timeReference}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
