'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'

export interface TransparencyDocument {
  id: string
  title: string
  document_type: string
  file_url: string
  file_path: string
  file_size_bytes: number | null
  published_date: string | null
  display_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

/** Public: fetch only published documents for the transparency page */
export async function getPublishedDocuments(): Promise<TransparencyDocument[]> {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('transparency_documents')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as TransparencyDocument[]
}

/** Admin: fetch all documents (including unpublished) */
export async function getAllDocumentsForAdmin(): Promise<TransparencyDocument[]> {
  const supabase = createServiceRoleClient()
  const { data, error } = await supabase
    .from('transparency_documents')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as TransparencyDocument[]
}
