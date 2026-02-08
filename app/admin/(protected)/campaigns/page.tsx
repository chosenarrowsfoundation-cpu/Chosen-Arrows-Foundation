import { getCampaigns } from '@/app/actions/campaigns/get-campaigns'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Flag } from 'lucide-react'
import { Suspense } from 'react'
import CampaignsTable from './CampaignsTable'

export default async function CampaignsPage() {
  const campaigns = await getCampaigns('en', { admin: true, status: 'all' })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Flag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Child Sponsorship Campaigns</h1>
            <p className="text-sm text-muted-foreground">
              Manage all fundraising campaigns and child sponsorship data. Click any campaign title or Edit to modify.
            </p>
          </div>
        </div>
        <Link href="/admin/campaigns/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Button>
        </Link>
      </div>

      <Suspense fallback={
        <div className="text-center py-8 text-muted-foreground">
          Loading campaigns...
        </div>
      }>
        <CampaignsTable campaigns={campaigns} />
      </Suspense>
    </div>
  )
}
