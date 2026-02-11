'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { revalidatePath } from 'next/cache'

export type DeleteCampaignResult = 
  | { success: true }
  | { success: false; error: string }

/**
 * Deletes a campaign and all related data (cascade).
 */
export async function deleteCampaign(
  campaignId: string
): Promise<DeleteCampaignResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', campaignId)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/campaigns')
  revalidatePath('/campaigns')
  revalidatePath('/')

  return { success: true }
}
