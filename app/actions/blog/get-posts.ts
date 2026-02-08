'use server'

import { createClient } from '@/lib/supabase/server'

export type BlogPost = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  author_name: string | null
  status: string
  published_at: string | null
  created_at: string
  updated_at: string
}

export async function getBlogPosts(options?: { publishedOnly?: boolean; admin?: boolean }): Promise<BlogPost[]> {
  const supabase = await createClient()
  let query = supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (options?.publishedOnly && !options?.admin) {
    query = query.eq('status', 'published').not('published_at', 'is', null)
  }
  const { data, error } = await query
  if (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
  return (data || []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? null,
    content: row.content ?? '',
    cover_image_url: row.cover_image_url ?? null,
    author_name: row.author_name ?? null,
    status: row.status,
    published_at: row.published_at ?? null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }))
}
