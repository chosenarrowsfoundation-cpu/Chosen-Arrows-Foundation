'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'

export interface TopItem {
  entityName: string
  metricValue: string | number
  rank?: number
  href?: string
  subtitle?: string
  progress?: number
}

interface TopItemsProps {
  title?: string
  items: TopItem[]
  valuePrefix?: string
  valueSuffix?: string
  className?: string
  maxItems?: number
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function TopItems({
  title = 'Top Items',
  items,
  valuePrefix = '',
  valueSuffix = '',
  className,
  maxItems = 5,
}: TopItemsProps) {
  const displayedItems = items.slice(0, maxItems)

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-1">
          {displayedItems.length > 0 ? (
            displayedItems.map((item, index) => {
              const content = (
                <div className={cn(
                  'flex items-center justify-between py-3 px-2 rounded-lg',
                  item.href && 'hover:bg-muted/50 transition-colors cursor-pointer'
                )}>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {item.entityName}
                    </p>
                    {item.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">
                        {item.subtitle}
                      </p>
                    )}
                    {item.progress !== undefined && (
                      <div className="mt-1.5 h-1.5 w-full max-w-[100px] rounded-full bg-muted overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <span className="text-sm font-semibold text-foreground ml-4 shrink-0">
                    {valuePrefix}
                    {typeof item.metricValue === 'number' 
                      ? item.metricValue.toLocaleString() 
                      : item.metricValue}
                    {valueSuffix}
                  </span>
                </div>
              )

              if (item.href) {
                return (
                  <Link key={index} href={item.href} className="block">
                    {content}
                  </Link>
                )
              }

              return <div key={index}>{content}</div>
            })
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">No items found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
