'use server'

import { createClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'

export type MediaFile = {
  name: string
  path: string
  url: string
  size: number
  updated_at: string
}

/**
 * Lists files in a path. For folders (items with id === null), recursively lists contents.
 * Campaign images live in campaigns/{campaignId}/filename.jpg, so we must recurse into campaign subfolders.
 */
async function listRecursive(
  supabase: Awaited<ReturnType<typeof createClient>>,
  folder: string
): Promise<MediaFile[]> {
  const { data, error } = await supabase.storage
    .from('images')
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'updated_at', order: 'desc' },
    })

  if (error) {
    console.error('Error listing images:', error)
    return []
  }

  const imageExtensions = /\.(jpg|jpeg|png|webp|gif)$/i
  const files: MediaFile[] = []
  for (const item of data || []) {
    const fullPath = folder ? `${folder}/${item.name}` : item.name
    const hasImageExt = imageExtensions.test(item.name)
    const looksLikeFile = hasImageExt || (Number(item.metadata?.size) > 0 && item.metadata?.mimetype)
    const isFolder = !looksLikeFile

    if (isFolder) {
      // Recurse into subfolder (e.g. campaigns/campaignId)
      const nested = await listRecursive(supabase, fullPath)
      files.push(...nested)
    } else {
      files.push({
        name: item.name,
        path: fullPath,
        url: supabase.storage.from('images').getPublicUrl(fullPath).data.publicUrl,
        size: item.metadata?.size ?? 0,
        updated_at: item.updated_at || item.created_at || '',
      })
    }
  }
  return files
}

/**
 * Lists all images in a storage folder.
 * For the campaigns folder, recursively lists files inside campaign subfolders.
 */
export async function listImages(
  folder: string = ''
): Promise<MediaFile[]> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return []
  }

  const supabase = await createClient()
  return listRecursive(supabase, folder)
}
