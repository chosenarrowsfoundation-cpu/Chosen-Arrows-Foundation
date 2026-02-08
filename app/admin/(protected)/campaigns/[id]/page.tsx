import { getCampaign } from '@/app/actions/campaigns/get-campaign'
import CampaignEditor from '@/components/admin/CampaignEditor'
import { notFound } from 'next/navigation'
import { languages } from '@/lib/constants'
import { createClient } from '@/lib/supabase/server'

export default async function EditCampaignPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const campaignsByLanguage = await Promise.all(
    languages.map(lang => getCampaign(id, lang))
  )

  const campaign = campaignsByLanguage.find(c => c !== null)

  if (!campaign) {
    notFound()
  }

  const supabase = await createClient()
  const { data: images } = await supabase
    .from('campaign_images')
    .select('*')
    .eq('campaign_id', campaign.id)
    .order('display_order')

  // Merge translations from all languages
  const translationsByLanguage: Record<string, typeof campaign.translation> = {}
  campaignsByLanguage.forEach((c, index) => {
    if (c?.translation) {
      translationsByLanguage[languages[index]] = c.translation
    }
  })

  // Create enhanced campaign object with all translations and images
  const campaignWithAllTranslations = {
    ...campaign,
    translationsByLanguage,
    images: images || [],
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Campaign
        </h1>
        <p className="text-muted-foreground">
          {campaign.translation?.title || 'Untitled Campaign'}
        </p>
      </div>

      <CampaignEditor campaign={campaignWithAllTranslations} />
    </div>
  )
}
