'use server'

import { createClient } from '@/lib/supabase/server'

export type JourneyGalleryItem = {
  id: string
  src: string
  alt: string
  span: string
}

/**
 * Returns gallery items for "Our Journey in Pictures" (public, no auth).
 * Paths starting with "journey/" are resolved to Supabase storage public URLs.
 */
export async function getJourneyGallery(): Promise<JourneyGalleryItem[]> {
  const supabase = await createClient()

  const { data: rows, error } = await supabase
    .from('journey_gallery')
    .select('id, path, alt, span')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching journey gallery:', error)
    return []
  }

  return (rows || []).map((row) => {
    const path = row.path as string
    const src =
      path.startsWith('journey/') || path.startsWith('campaigns/') || path.startsWith('content/')
        ? supabase.storage.from('images').getPublicUrl(path).data.publicUrl
        : encodeURI(path) // encode spaces/special chars in static paths (e.g. /about/ file name.jpeg)
    return {
      id: row.id,
      src,
      alt: (row.alt as string) || '',
      span: (row.span as string) || 'col-span-1 row-span-1',
    }
  })
}
