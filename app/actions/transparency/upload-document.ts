'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'

export type UploadDocumentResult =
  | { success: true; url: string; path: string }
  | { success: false; error: string }

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'text/plain',
  'text/csv',
]
const MAX_SIZE = 20 * 1024 * 1024 // 20MB

export async function uploadTransparencyDocument(file: File): Promise<UploadDocumentResult> {
  try {
    const { user, error: authError } = await checkAdminAuth()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Allowed: PDF, DOC, DOCX, TXT, CSV.',
      }
    }

    if (file.size > MAX_SIZE) {
      return { success: false, error: 'File size exceeds 20MB limit.' }
    }

    const supabase = createServiceRoleClient()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const finalFileName = `${Date.now()}-${safeName}`
    const filePath = `transparency/${finalFileName}`

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

    const {
      data: { publicUrl },
    } = supabase.storage.from('images').getPublicUrl(filePath)

    return { success: true, url: publicUrl, path: filePath }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return { success: false, error: message }
  }
}
