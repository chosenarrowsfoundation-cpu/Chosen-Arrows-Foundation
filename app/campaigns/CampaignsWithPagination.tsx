'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { UnifiedCampaignCard } from '@/components/ui/campaign-card'
import { Pagination } from '@/components/ui/pagination'

const CAMPAIGNS_PER_PAGE = 10

interface CampaignWithPagination {
  id: string;
  slug: string;
  title: string;
  child: string;
  story: string;
  image: string | null;
  raised: number;
  goal: number;
  supporters: number;
  daysLeft: number | null;
  category: string;
}

interface CampaignsWithPaginationProps {
  campaigns: CampaignWithPagination[];
}

export default function CampaignsWithPagination({ campaigns }: CampaignsWithPaginationProps) {
  const searchParams = useSearchParams()
  const [currentPage, setCurrentPage] = useState(1)
  const [paginatedCampaigns, setPaginatedCampaigns] = useState<CampaignWithPagination[]>([])

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

  if (totalPages === 0 && campaigns.length === 0) {
    return (
      <main className="pt-24 pb-20">
        <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                Active <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Campaigns</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                No active campaigns at the moment. Check back soon!
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20">
      {/* Header */}
      <section className="py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Active <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Campaigns</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Every child has a story. Every campaign is a step toward their divine destiny.
            </p>
          </div>
        </div>
      </section>

      {/* Campaigns Grid with Pagination */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {paginatedCampaigns.map((campaign) => (
              <UnifiedCampaignCard
                key={campaign.id}
                campaign={campaign}
                buttonText={`Sponsor ${campaign.child.split(',')[0]}`}
                variant="campaigns"
                showCategory={true}
                imageHeight="h-64"
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/campaigns"
              showPreviousNext={true}
              showFirstLast={false}
              maxPageButtons={5}
            />
          )}
        </div>
      </section>
    </main>
  );
}