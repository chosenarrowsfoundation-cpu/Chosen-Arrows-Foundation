'use server'

import { createClient } from '@/lib/supabase/server'

export type ChangePasswordResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Changes the current admin's password in Supabase Auth.
 * Requires current password for verification.
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<ChangePasswordResult> {
  const supabase = await createClient()

  const { data: { user }, error: getUserError } = await supabase.auth.getUser()
  if (getUserError || !user?.email) {
    return { success: false, error: 'Not authenticated' }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  })
  if (signInError) {
    return { success: false, error: 'Current password is incorrect' }
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  })
  if (updateError) {
    return { success: false, error: updateError.message }
  }

  return { success: true }
}
