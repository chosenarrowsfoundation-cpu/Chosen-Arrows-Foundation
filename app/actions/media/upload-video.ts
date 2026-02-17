'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'

export type UploadVideoResult =
  | { success: true; url: string; path: string }
  | { success: false; error: string }

/**
 * Uploads a video to Supabase Storage (images bucket, hero folder).
 */
export async function uploadVideo(
  file: File,
  folder = 'hero',
  fileName?: string
): Promise<UploadVideoResult> {
  try {
    const { user, error: authError } = await checkAdminAuth()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const allowedTypes = ['video/mp4', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only MP4 and WebM are allowed.' }
    }

    // 50MB max (Supabase free tier limit)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return { success: false, error: 'File size exceeds 50MB limit.' }
    }

    const supabase = createServiceRoleClient()
    const finalFileName = fileName || `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `${folder}/${finalFileName}`

    const arrayBuffer = await file.arrayBuffer()
    const bytes = new Uint8Array(arrayBuffer)

    const { error } = await supabase.storage
      .from('images')
      .upload(filePath, bytes, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      return { success: false, error: error.message }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return { success: true, url: publicUrl, path: filePath }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return { success: false, error: message }
  }
}
