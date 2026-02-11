'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { revalidatePath } from 'next/cache'
import type { CampaignInput } from './create-campaign'

export type CampaignUpdateInput = Partial<Omit<CampaignInput, 'translations'> & {
  translations: Partial<CampaignInput['translations'][0]>[]
}>

export type UpdateCampaignResult = 
  | { success: true }
  | { success: false; error: string }

/**
 * Updates an existing campaign.
 */
export async function updateCampaign(
  campaignId: string,
  data: CampaignUpdateInput
): Promise<UpdateCampaignResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = await createClient()

  // Update campaign basic info
  const campaignUpdate: any = {
    updated_by: user.id,
  }

  if (data.slug !== undefined) campaignUpdate.slug = data.slug
  if (data.status !== undefined) campaignUpdate.status = data.status
  if (data.goal_amount !== undefined) campaignUpdate.goal_amount = data.goal_amount
  if (data.raised_amount !== undefined) campaignUpdate.raised_amount = data.raised_amount
  if (data.donor_count !== undefined) campaignUpdate.donor_count = data.donor_count
  if (data.days_left !== undefined) campaignUpdate.days_left = data.days_left
  if (data.category !== undefined) campaignUpdate.category = data.category
  if (data.featured !== undefined) campaignUpdate.featured = data.featured

  const { error: campaignError } = await supabase
    .from('campaigns')
    .update(campaignUpdate)
    .eq('id', campaignId)

  if (campaignError) {
    return { success: false, error: campaignError.message }
  }

  // Update translations if provided
  if (data.translations && data.translations.length > 0) {
    for (const translation of data.translations) {
      if (translation.language_code && translation.title && translation.story) {
        const { error: translationError } = await supabase
          .from('campaign_translations')
          .upsert({
            campaign_id: campaignId,
            language_code: translation.language_code,
            title: translation.title,
            story: translation.story,
            full_story: translation.full_story || null,
          child_name: translation.child_name || null,
          child_age: translation.child_age || null,
          location: translation.location || null,
        }, {
          onConflict: 'campaign_id,language_code',
        })

        if (translationError) {
          return { success: false, error: translationError.message }
        }
      }
    }
  }

  revalidatePath(`/admin/campaigns/${campaignId}`)
  revalidatePath('/admin/campaigns')
  revalidatePath('/campaigns')
  revalidatePath(`/campaigns/${campaignId}`)
  revalidatePath('/')

  return { success: true }
}
