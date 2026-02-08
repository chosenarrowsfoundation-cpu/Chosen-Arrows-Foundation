'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'
import { revalidatePath } from 'next/cache'

export type CreatePostInput = {
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

export async function createBlogPost(input: CreatePostInput): Promise<{ id: string } | { error: string }> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) return { error: 'Unauthorized' }

  const supabase = await createClient()
  const now = new Date().toISOString()
  const row = {
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
    published_at: input.status === 'published' ? now : null,
    updated_at: now,
    updated_by: user.id,
    created_by: user.id,
  }
  const { data, error } = await supabase.from('blog_posts').insert(row).select('id').single()
  if (error) {
    console.error('createBlogPost error:', error)
    return { error: error.message }
  }
  revalidatePath('/blog')
  revalidatePath('/admin/blog')
  return { id: data.id }
}
