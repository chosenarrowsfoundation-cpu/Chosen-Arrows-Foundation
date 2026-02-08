'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { revalidatePath } from 'next/cache'

export type UpdatePostInput = {
  slug: string
  title: string
  excerpt?: string | null
  content: string
  cover_image_url?: string | null
  author_name?: string | null
  status: 'draft' | 'published'
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string[] | null
  og_image_url?: string | null
}

export async function updateBlogPost(id: string, input: UpdatePostInput): Promise<{ ok: true } | { error: string }> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const now = new Date().toISOString()
  const updates: Record<string, unknown> = {
    slug: input.slug.trim().toLowerCase().replace(/\s+/g, '-'),
    title: input.title.trim(),
    excerpt: input.excerpt?.trim() || null,
    content: input.content || '',
    cover_image_url: input.cover_image_url || null,
    author_name: input.author_name?.trim() || null,
    status: input.status,
    meta_title: input.meta_title?.trim() || null,
    meta_description: input.meta_description?.trim() || null,
    meta_keywords: input.meta_keywords?.length ? input.meta_keywords : null,
    og_image_url: input.og_image_url?.trim() || null,
    updated_at: now,
    updated_by: user.id,
  }
  if (input.status === 'published') {
    const { data: existing } = await supabase.from('blog_posts').select('published_at').eq('id', id).single()
    if (existing && !existing.published_at) updates.published_at = now
  } else {
    updates.published_at = null
  }
  const { error } = await supabase.from('blog_posts').update(updates).eq('id', id)
  if (error) {
    console.error('updateBlogPost error:', error)
    return { error: error.message }
  }
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  revalidatePath(`/blog/${(updates.slug as string) || ''}`)
  return { ok: true }
}
