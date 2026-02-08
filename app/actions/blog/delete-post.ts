'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { revalidatePath } from 'next/cache'

export async function deleteBlogPost(id: string): Promise<{ ok: true } | { error: string }> {
  const { error: authError } = await checkAdminAuth()
  if (authError) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', id)
  if (error) {
    console.error('deleteBlogPost error:', error)
    return { error: error.message }
  }
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { ok: true }
}
