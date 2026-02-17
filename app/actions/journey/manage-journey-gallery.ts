'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'

export type JourneyGalleryRow = {
  id: string
  path: string
  alt: string
  span: string
  sort_order: number
  /** Resolved URL for preview (static path or storage public URL) */
  previewUrl?: string
}

export async function getJourneyGalleryForAdmin(): Promise<JourneyGalleryRow[]> {
  const { error: authError } = await checkAdminAuth()
  if (authError) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('journey_gallery')
    .select('id, path, alt, span, sort_order')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching journey gallery for admin:', error)
    return []
  }

  const rows = (data || []) as { id: string; path: string; alt: string; span: string; sort_order: number }[]
  return rows.map((row) => {
    const path = row.path
    const previewUrl =
      path.startsWith('journey/') || path.startsWith('campaigns/') || path.startsWith('content/')
        ? supabase.storage.from('images').getPublicUrl(path).data.publicUrl
        : path
    return { ...row, previewUrl }
  })
}

export async function addJourneyImage(
  path: string,
  alt: string,
  span: string
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  const { error: authError } = await checkAdminAuth()
  if (authError) return { success: false, error: 'Unauthorized' }

  const supabase = await createClient()
  const { data: max } = await supabase
    .from('journey_gallery')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .single()

  const sortOrder = (max?.sort_order ?? -1) + 1

  const { data, error } = await supabase
    .from('journey_gallery')
    .insert({ path, alt: alt || '', span: span || 'col-span-1 row-span-1', sort_order: sortOrder })
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }
  return { success: true, id: data.id }
}

export async function updateJourneyImage(
  id: string,
  updates: { alt?: string; span?: string }
): Promise<{ success: boolean; error?: string }> {
  const { error: authError } = await checkAdminAuth()
  if (authError) return { success: false, error: 'Unauthorized' }

  const supabase = await createClient()
  const { error } = await supabase.from('journey_gallery').update(updates).eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function reorderJourneyGallery(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  const { error: authError } = await checkAdminAuth()
  if (authError) return { success: false, error: 'Unauthorized' }

  const supabase = await createClient()
  for (let i = 0; i < orderedIds.length; i++) {
    const { error } = await supabase
      .from('journey_gallery')
      .update({ sort_order: i })
      .eq('id', orderedIds[i])
    if (error) return { success: false, error: error.message }
  }
  return { success: true }
}

export async function deleteJourneyImage(id: string): Promise<{ success: boolean; error?: string }> {
  const { error: authError } = await checkAdminAuth()
  if (authError) return { success: false, error: 'Unauthorized' }

  const supabase = await createClient()
  const { error } = await supabase.from('journey_gallery').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  return { success: true }
}
