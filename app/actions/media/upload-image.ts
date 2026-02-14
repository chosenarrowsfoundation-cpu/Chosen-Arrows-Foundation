'use server'

import { createClient, createServiceRoleClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'

export type UploadImageResult = 
  | { success: true; url: string; path: string }
  | { success: false; error: string }

/**
 * Uploads an image to Supabase Storage.
 */
export async function uploadImage(
  file: File,
  folder: string,
  fileName?: string
): Promise<UploadImageResult> {
  try {
    const { user, error: authError } = await checkAdminAuth()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'File size exceeds 5MB limit.' }
    }

    // Use service role so storage upload works regardless of session forwarding.
    // Admin identity is already checked above.
    const supabase = createServiceRoleClient()
    const finalFileName = fileName || `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = `${folder}/${finalFileName}`

    // Convert File to Uint8Array (works in Node and Edge; Buffer is Node-only)
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
