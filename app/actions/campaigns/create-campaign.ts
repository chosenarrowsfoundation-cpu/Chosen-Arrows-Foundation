'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { revalidatePath } from 'next/cache'

export type CreateCampaignResult = 
  | { success: true; campaignId: string }
  | { success: false; error: string }

export type CampaignInput = {
  slug: string
  status: 'draft' | 'active' | 'completed' | 'archived'
  goal_amount: number
  raised_amount?: number
  donor_count?: number
  days_left?: number | null
  category?: string | null
  featured?: boolean
  translations: {
    language_code: string
    title: string
    story: string
    full_story?: string | null
    child_name?: string | null
    child_age?: number | null
    location?: string | null
  }[]
}

/**
 * Creates a new campaign with translations.
 */
export async function createCampaign(
  data: CampaignInput
): Promise<CreateCampaignResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = await createClient()

  // Create campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .insert({
      slug: data.slug,
      status: data.status,
      goal_amount: data.goal_amount,
      raised_amount: data.raised_amount || 0,
      donor_count: data.donor_count || 0,
      days_left: data.days_left,
      category: data.category,
      featured: data.featured || false,
      created_by: user.id,
      updated_by: user.id,
    })
    .select('id')
    .single()

  if (campaignError || !campaign) {
    return { success: false, error: campaignError?.message || 'Failed to create campaign' }
  }

  // Create translations
  const translations = data.translations.map(t => ({
    campaign_id: campaign.id,
    language_code: t.language_code,
    title: t.title,
    story: t.story,
    full_story: t.full_story || null,
    child_name: t.child_name || null,
    child_age: t.child_age || null,
    location: t.location || null,
  }))

  const { error: translationError } = await supabase
    .from('campaign_translations')
    .insert(translations)

  if (translationError) {
    // Rollback: delete campaign if translations fail
    await supabase.from('campaigns').delete().eq('id', campaign.id)
    return { success: false, error: translationError.message }
  }

  revalidatePath('/admin/campaigns')
  revalidatePath('/campaigns')
  revalidatePath('/')

  return { success: true, campaignId: campaign.id }
}
