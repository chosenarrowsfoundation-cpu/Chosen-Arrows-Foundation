'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { revalidatePath } from 'next/cache'

export type UpdateMentorApplicationResult =
  | { success: true }
  | { success: false; error: string }

export async function updateMentorApplication(
  id: string,
  updates: { status?: string; first_name?: string; last_name?: string; email?: string; phone?: string | null; occupation?: string | null; why_mentor?: string | null; skills_expertise?: string | null; availability?: string | null }
): Promise<UpdateMentorApplicationResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const filtered: Record<string, unknown> = {}
  if (updates.status !== undefined) filtered.status = updates.status
  if (updates.first_name !== undefined) filtered.first_name = updates.first_name
  if (updates.last_name !== undefined) filtered.last_name = updates.last_name
  if (updates.email !== undefined) filtered.email = updates.email
  if (updates.phone !== undefined) filtered.phone = updates.phone
  if (updates.occupation !== undefined) filtered.occupation = updates.occupation
  if (updates.why_mentor !== undefined) filtered.why_mentor = updates.why_mentor
  if (updates.skills_expertise !== undefined) filtered.skills_expertise = updates.skills_expertise
  if (updates.availability !== undefined) filtered.availability = updates.availability

  if (Object.keys(filtered).length === 0) {
    return { success: true }
  }

  try {
    const supabase = createServiceRoleClient()
    const { error } = await supabase
      .from('mentor_applications')
      .update({ ...filtered, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/admin/mentors')
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update application'
    return { success: false, error: message }
  }
}
