'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { revalidatePath } from 'next/cache'

export type UpdateSettingsResult = 
  | { success: true }
  | { success: false; error: string }

/**
 * Updates a site setting.
 */
export async function updateSetting(
  settingKey: string,
  settingValue: Record<string, any>,
  description?: string
): Promise<UpdateSettingsResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from('site_settings')
    .upsert({
      setting_key: settingKey,
      setting_value: settingValue,
      description: description || null,
      updated_by: user.id,
    }, {
      onConflict: 'setting_key',
    })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/settings')
  if (settingKey === 'manual_payment_details') {
    revalidatePath('/donate')
  }

  return { success: true }
}

/**
 * Updates multiple settings at once.
 */
export async function updateMultipleSettings(
  settings: Array<{ key: string; value: Record<string, any>; description?: string }>
): Promise<UpdateSettingsResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = createServiceRoleClient()

  const updates = settings.map(setting => ({
    setting_key: setting.key,
    setting_value: setting.value,
    description: setting.description || null,
    updated_by: user.id,
  }))

  const { error } = await supabase
    .from('site_settings')
    .upsert(updates, {
      onConflict: 'setting_key',
    })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin/settings')
  if (settings.some(s => s.key === 'manual_payment_details')) {
    revalidatePath('/donate')
  }

  return { success: true }
}
