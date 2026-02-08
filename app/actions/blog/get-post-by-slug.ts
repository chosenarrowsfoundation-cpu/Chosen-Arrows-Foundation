'use server'

import { createClient } from '@/lib/supabase/server'

export type BlogPostDetail = {
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
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  og_image_url: string | null
}

export async function getBlogPostBySlug(slug: string, options?: { admin?: boolean }): Promise<BlogPostDetail | null> {
  const supabase = await createClient()
  const base = supabase.from('blog_posts').select('*').eq('slug', slug)
  const { data, error } = options?.admin
    ? await base.single()
    : await base.eq('status', 'published').single()
  if (error || !data) return null
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt ?? null,
    content: data.content ?? '',
    cover_image_url: data.cover_image_url ?? null,
    author_name: data.author_name ?? null,
    status: data.status,
    published_at: data.published_at ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
    meta_title: data.meta_title ?? null,
    meta_description: data.meta_description ?? null,
    meta_keywords: data.meta_keywords ?? null,
    og_image_url: data.og_image_url ?? null,
  }
}

export async function getBlogPostById(id: string): Promise<BlogPostDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single()
  if (error || !data) return null
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt ?? null,
    content: data.content ?? '',
    cover_image_url: data.cover_image_url ?? null,
    author_name: data.author_name ?? null,
    status: data.status,
    published_at: data.published_at ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at,
    meta_title: data.meta_title ?? null,
    meta_description: data.meta_description ?? null,
    meta_keywords: data.meta_keywords ?? null,
    og_image_url: data.og_image_url ?? null,
  }
}
