'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { revalidatePath } from 'next/cache'
import { INTEGRATION_KEYS } from '@/lib/integration-config-keys'

const MASK = '••••••••'

const ALLOWED_KEYS = new Set<string>(Object.values(INTEGRATION_KEYS))

export type UpdateIntegrationConfigResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Updates integration config (API keys, etc.). Admin only.
 * Pass only keys you want to update; omit or pass MASK for secrets to leave unchanged.
 */
export async function updateIntegrationConfig(
  updates: Record<string, string>
): Promise<UpdateIntegrationConfigResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const filtered: Record<string, string> = {}
  for (const [key, value] of Object.entries(updates)) {
    if (!ALLOWED_KEYS.has(key)) continue
    const v = (value ?? '').trim()
    if (v && v !== MASK) filtered[key] = v
  }

  if (Object.keys(filtered).length === 0) {
    return { success: true }
  }

  try {
    const supabase = createServiceRoleClient()
    for (const [key, value] of Object.entries(filtered)) {
      await supabase
        .from('integration_config')
        .upsert(
          { key, value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        )
    }
    revalidatePath('/admin/settings')
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to save'
    return { success: false, error: message }
  }
}
