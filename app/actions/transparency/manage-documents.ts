'use server'

import { createServiceRoleClient } from '@/lib/supabase/server'
import { checkAdminAuth } from '@/app/actions/auth/check-admin-auth'

export type ActionResult = { success: true } | { success: false; error: string }

interface CreateDocumentInput {
  title: string
  document_type: string
  file_url: string
  file_path: string
  file_size_bytes?: number
  published_date?: string
  display_order?: number
}

export async function createTransparencyDocument(
  input: CreateDocumentInput
): Promise<{ success: true; id: string } | { success: false; error: string }> {
  try {
    const { user, error: authError } = await checkAdminAuth()
    if (authError || !user) {
      return { success: false, error: 'Unauthorized' }
    }

    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('transparency_documents')
      .insert({
        title: input.title,
        document_type: input.document_type,
        file_url: input.file_url,
        file_path: input.file_path,
        file_size_bytes: input.file_size_bytes ?? null,
        published_date: input.published_date ?? null,
        display_order: input.display_order ?? 0,
        is_published: true,
        created_by: user.id,
      })
      .select('id')
      .single()

    if (error) return { success: false, error: error.message }
    return { success: true, id: data.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create document'
    return { success: false, error: message }
  }
}

export async function updateTransparencyDocument(
  id: string,
  updates: Partial<{
    title: string
    document_type: string
    file_url: string
    file_path: string
    file_size_bytes: number
    published_date: string
    display_order: number
    is_published: boolean
  }>
): Promise<ActionResult> {
  try {
    const { error: authError } = await checkAdminAuth()
    if (authError) return { success: false, error: 'Unauthorized' }

    const supabase = createServiceRoleClient()
    const { error } = await supabase
      .from('transparency_documents')
      .update(updates)
      .eq('id', id)

    if (error) return { success: false, error: error.message }
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update document'
    return { success: false, error: message }
  }
}

export async function reorderTransparencyDocument(
  id: string,
  direction: 'up' | 'down'
): Promise<ActionResult> {
  try {
    const { error: authError } = await checkAdminAuth()
    if (authError) return { success: false, error: 'Unauthorized' }

    const supabase = createServiceRoleClient()

    const { data: docs, error: fetchError } = await supabase
      .from('transparency_documents')
      .select('id, display_order')
      .order('display_order', { ascending: true })

    if (fetchError) return { success: false, error: fetchError.message }
    if (!docs?.length) return { success: false, error: 'No documents' }

    const idx = docs.findIndex((d) => d.id === id)
    if (idx < 0) return { success: false, error: 'Document not found' }

    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= docs.length) return { success: true } // Already at edge

    const [docA, docB] = [docs[idx], docs[swapIdx]]
    const orderA = docA.display_order
    const orderB = docB.display_order

    const { error: err1 } = await supabase
      .from('transparency_documents')
      .update({ display_order: orderB })
      .eq('id', docA.id)
    if (err1) return { success: false, error: err1.message }

    const { error: err2 } = await supabase
      .from('transparency_documents')
      .update({ display_order: orderA })
      .eq('id', docB.id)
    if (err2) return { success: false, error: err2.message }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to reorder'
    return { success: false, error: message }
  }
}

export async function deleteTransparencyDocument(id: string): Promise<ActionResult> {
  try {
    const { error: authError } = await checkAdminAuth()
    if (authError) return { success: false, error: 'Unauthorized' }

    const supabase = createServiceRoleClient()

    // Get file path before deleting record
    const { data: doc } = await supabase
      .from('transparency_documents')
      .select('file_path')
      .eq('id', id)
      .single()

    const { error: deleteError } = await supabase
      .from('transparency_documents')
      .delete()
      .eq('id', id)

    if (deleteError) return { success: false, error: deleteError.message }

    // Remove file from storage (best-effort; skip for seed placeholders that were never uploaded)
    if (doc?.file_path && !doc.file_path.includes('placeholder')) {
      await supabase.storage.from('images').remove([doc.file_path])
    }

    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete document'
    return { success: false, error: message }
  }
}
