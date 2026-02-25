'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Image from 'next/image'
import Link from 'next/link'
import CampaignActions from '@/components/admin/CampaignActions'
import { Pagination } from '@/components/ui/pagination'
import type { Campaign } from '@/app/actions/campaigns/get-campaigns'

const CAMPAIGNS_PER_PAGE = 10

const statusColors: Record<string, string> = {
  draft: 'bg-amber-100 text-amber-800 border-amber-200',
  active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  completed: 'bg-blue-100 text-blue-800 border-blue-200',
  archived: 'bg-muted text-muted-foreground',
}

interface CampaignsTableProps {
  campaigns: Campaign[]
}

export default function CampaignsTable({ campaigns }: CampaignsTableProps) {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedCampaigns, setPaginatedCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    const page = searchParams.get('page')
    if (page) {
      const pageNum = parseInt(page)
      if (!isNaN(pageNum) && pageNum > 0) {
        setCurrentPage(pageNum)
      } else {
        setCurrentPage(1)
      }
    } else {
      setCurrentPage(1)
    }
  }, [searchParams])

  useEffect(() => {
    const startIndex = (currentPage - 1) * CAMPAIGNS_PER_PAGE
    const endIndex = startIndex + CAMPAIGNS_PER_PAGE
    setPaginatedCampaigns(campaigns.slice(startIndex, endIndex))
  }, [campaigns, currentPage])

  const totalPages = Math.ceil(campaigns.length / CAMPAIGNS_PER_PAGE)

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden min-w-0">
        <div className="overflow-x-auto min-w-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Child</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Donors</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead className="text-right w-[140px]">Edit / More</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCampaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                  No campaigns found. Create your first campaign to get started.
                </TableCell>
              </TableRow>
            ) : (
              paginatedCampaigns.map((campaign) => {
                const progress = campaign.goal_amount > 0
                  ? Math.min((campaign.raised_amount / campaign.goal_amount) * 100, 100)
                  : 0

                return (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      {campaign.primaryImage ? (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden">
                          <Image
                            src={campaign.primaryImage}
                            alt={campaign.translation?.title || 'Campaign'}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-muted" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <Link
                          href={`/admin/campaigns/${campaign.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {campaign.translation?.title || 'Untitled Campaign'}
                        </Link>
                        {campaign.featured && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {campaign.translation?.child_name || '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {campaign.translation?.child_age ? `${campaign.translation.child_age} years` : '-'}
                    </TableCell>
                    <TableCell>
                      {campaign.translation?.location || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${statusColors[campaign.status] || 'bg-muted'}`}
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>${campaign.raised_amount.toLocaleString()}</span>
                          <span className="text-muted-foreground">
                            of ${campaign.goal_amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.category || '-'}</TableCell>
                    <TableCell>{campaign.donor_count}</TableCell>
                    <TableCell>
                      {campaign.days_left !== null ? `${campaign.days_left} days` : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <CampaignActions campaignId={campaign.id} slug={campaign.slug} />
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
        </div>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Showing {((currentPage - 1) * CAMPAIGNS_PER_PAGE) + 1} to {Math.min(currentPage * CAMPAIGNS_PER_PAGE, campaigns.length)} of {campaigns.length} campaigns
          </div>
          <div className="order-1 sm:order-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl="/admin/campaigns"
            showPreviousNext={true}
            showFirstLast={false}
            maxPageButtons={5}
          />
          </div>
        </div>
      )}
    </div>
  )
}