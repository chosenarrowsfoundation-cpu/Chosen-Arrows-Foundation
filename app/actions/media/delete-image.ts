'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'

export type DeleteImageResult =
  | { success: true }
  | { success: false; error: string }

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)$/i
const UUID_LIKE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function listAllFilePaths(
  supabase: ReturnType<typeof createServiceRoleClient>,
  folder: string
): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from('images')
    .list(folder, { limit: 100 })

  if (error || !data) return []

  const paths: string[] = []
  for (const item of data) {
    const fullPath = folder ? `${folder}/${item.name}` : item.name
    const hasImageExt = IMAGE_EXTENSIONS.test(item.name)
    const isLikelySubfolder = UUID_LIKE.test(item.name) || (!hasImageExt && !item.name.includes('.'))

    if (isLikelySubfolder) {
      paths.push(...(await listAllFilePaths(supabase, fullPath)))
    } else {
      paths.push(fullPath)
    }
  }
  return paths
}

/**
 * Deletes an image (or all files in a folder) from Supabase Storage.
 * Uses service role to avoid RLS/session issues.
 */
export async function deleteImage(filePath: string): Promise<DeleteImageResult> {
  const { user, error: authError } = await checkAdminAuth()
  if (authError || !user) {
    return { success: false, error: 'Unauthorized' }
  }

  const supabase = createServiceRoleClient()
  const isFolderPath = !IMAGE_EXTENSIONS.test(filePath.split('/').pop() || '')

  let pathsToRemove: string[] = [filePath]
  if (isFolderPath) {
    const nestedPaths = await listAllFilePaths(supabase, filePath)
    if (nestedPaths.length === 0) {
      return { success: true }
    }
    pathsToRemove = nestedPaths
  }

  const { error } = await supabase.storage.from('images').remove(pathsToRemove)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
