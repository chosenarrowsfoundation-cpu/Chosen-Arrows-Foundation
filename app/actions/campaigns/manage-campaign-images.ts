'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { revalidatePath } from 'next/cache'

export type ManageCampaignImagesResult = 
  | { success: true }
  | { success: false; error: string }

/**
 * Adds an image to a campaign.
 */
export async function addCampaignImage(
  campaignId: string,
  imageUrl: string,
  imageAlt?: string,
  isPrimary: boolean = false
): Promise<ManageCampaignImagesResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = await createClient()

  // If setting as primary, unset other primary images
  if (isPrimary) {
    await supabase
      .from('campaign_images')
      .update({ is_primary: false })
      .eq('campaign_id', campaignId)
  }

  // Get max display_order
  const { data: existingImages } = await supabase
    .from('campaign_images')
    .select('display_order')
    .eq('campaign_id', campaignId)
    .order('display_order', { ascending: false })
    .limit(1)

  const displayOrder = existingImages && existingImages.length > 0
    ? existingImages[0].display_order + 1
    : 0

  const { error } = await supabase
    .from('campaign_images')
    .insert({
      campaign_id: campaignId,
      image_url: imageUrl,
      image_alt: imageAlt || null,
      is_primary: isPrimary,
      display_order: displayOrder,
    })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/admin/campaigns/${campaignId}`)
  revalidatePath('/admin/campaigns')
  revalidatePath('/campaigns')
  revalidatePath('/')

  return { success: true }
}

/**
 * Updates campaign image (alt text, primary status, order).
 */
export async function updateCampaignImage(
  imageId: string,
  campaignId: string,
  updates: {
    image_alt?: string
    is_primary?: boolean
    display_order?: number
  }
): Promise<ManageCampaignImagesResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = await createClient()

  // If setting as primary, unset other primary images
  if (updates.is_primary) {
    await supabase
      .from('campaign_images')
      .update({ is_primary: false })
      .eq('campaign_id', campaignId)
      .neq('id', imageId)
  }

  const { error } = await supabase
    .from('campaign_images')
    .update(updates)
    .eq('id', imageId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath(`/admin/campaigns/${campaignId}`)
  revalidatePath('/admin/campaigns')
  revalidatePath('/campaigns')
  revalidatePath('/')

  return { success: true }
}

/**
 * Deletes a campaign image.
 */
export async function deleteCampaignImage(
  imageId: string,
  campaignId: string,
  imageUrl: string
): Promise<ManageCampaignImagesResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = await createClient()

  // Delete from database
  const { error: dbError } = await supabase
    .from('campaign_images')
    .delete()
    .eq('id', imageId)

  if (dbError) {
    return { success: false, error: dbError.message }
  }

  // Try to delete from storage (extract path from URL)
  try {
    const urlParts = imageUrl.split('/storage/v1/object/public/images/')
    if (urlParts.length > 1) {
      const storagePath = urlParts[1]
      await supabase.storage
        .from('images')
        .remove([storagePath])
    }
  } catch (error) {
    // Storage deletion is optional - image might be referenced elsewhere
    console.warn('Could not delete image from storage:', error)
  }

  revalidatePath(`/admin/campaigns/${campaignId}`)
  revalidatePath('/admin/campaigns')
  revalidatePath('/campaigns')
  revalidatePath('/')

  return { success: true }
}
