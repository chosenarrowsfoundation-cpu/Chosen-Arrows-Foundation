'use client'

import { useState, useRef } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FileText, Plus, Pencil, Trash2, Loader2, ChevronUp, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import type { TransparencyDocument } from '@/app/actions/transparency/get-documents'
import {
  createTransparencyDocument,
  updateTransparencyDocument,
  deleteTransparencyDocument,
  reorderTransparencyDocument,
} from '@/app/actions/transparency/manage-documents'
import { uploadTransparencyDocument } from '@/app/actions/transparency/upload-document'

const DOCUMENT_TYPES = ['Impact', 'Financial', 'Project', 'Governance']

function formatFileSize(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface TransparencyDocumentsManagerProps {
  documents: TransparencyDocument[]
}

export default function TransparencyDocumentsManager({
  documents: initialDocuments,
}: TransparencyDocumentsManagerProps) {
  const [documents, setDocuments] = useState(initialDocuments)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [reorderingId, setReorderingId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: '',
    document_type: 'Impact',
    published_date: '',
    file: null as File | null,
    fileUrl: '',
    filePath: '',
    fileSizeBytes: 0,
  })

  const resetForm = () => {
    setForm({
      title: '',
      document_type: 'Impact',
      published_date: '',
      file: null,
      fileUrl: '',
      filePath: '',
      fileSizeBytes: 0,
    })
    setShowAddDialog(false)
    setEditingId(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setForm((prev) => ({
        ...prev,
        file,
        fileSizeBytes: file.size,
      }))
    }
  }

  const handleAddDocument = async () => {
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    if (!form.file && !form.fileUrl) {
      toast.error('Please upload a document')
      return
    }

    setIsSubmitting(true)
    try {
      let url = form.fileUrl
      let path = form.filePath
      let size = form.fileSizeBytes

      if (form.file) {
        setIsUploading(true)
        const uploadResult = await uploadTransparencyDocument(form.file)
        setIsUploading(false)
        if (!uploadResult.success) {
          toast.error((uploadResult as { success: false; error: string }).error)
          return
        }
        url = (uploadResult as { success: true; url: string; path: string }).url
        path = (uploadResult as { success: true; url: string; path: string }).path
        size = form.file.size
      }

      const result = await createTransparencyDocument({
        title: form.title.trim(),
        document_type: form.document_type,
        file_url: url,
        file_path: path,
        file_size_bytes: size,
        published_date: form.published_date.trim() || undefined,
      })

      if (result.success) {
        toast.success('Document added')
        setDocuments((prev) => [
          ...prev,
          {
            id: (result as { success: true; id: string }).id,
            title: form.title.trim(),
            document_type: form.document_type,
            file_url: url,
            file_path: path,
            file_size_bytes: size,
            published_date: form.published_date.trim() || null,
            display_order: 0,
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        resetForm()
      } else {
        toast.error((result as { success: false; error: string }).error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditDocument = async (doc: TransparencyDocument) => {
    setEditingId(doc.id)
    setForm({
      title: doc.title,
      document_type: doc.document_type,
      published_date: doc.published_date ?? '',
      file: null,
      fileUrl: doc.file_url,
      filePath: doc.file_path,
      fileSizeBytes: doc.file_size_bytes ?? 0,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsSubmitting(true)
    try {
      let url = form.fileUrl
      let path = form.filePath
      let size = form.fileSizeBytes

      if (form.file) {
        setIsUploading(true)
        const uploadResult = await uploadTransparencyDocument(form.file)
        setIsUploading(false)
        if (!uploadResult.success) {
          toast.error((uploadResult as { success: false; error: string }).error)
          return
        }
        url = (uploadResult as { success: true; url: string; path: string }).url
        path = (uploadResult as { success: true; url: string; path: string }).path
        size = form.file.size
      }

      const result = await updateTransparencyDocument(editingId, {
        title: form.title.trim(),
        document_type: form.document_type,
        published_date: form.published_date.trim() || null,
        file_url: url,
        file_path: path,
        file_size_bytes: size,
      })

      if (result.success) {
        toast.success('Document updated')
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === editingId
              ? {
                  ...d,
                  title: form.title.trim(),
                  document_type: form.document_type,
                  published_date: form.published_date.trim() || null,
                  file_url: url,
                  file_path: path,
                  file_size_bytes: size,
                }
              : d
          )
        )
        resetForm()
      } else {
        toast.error((result as { success: false; error: string }).error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    setReorderingId(id)
    const result = await reorderTransparencyDocument(id, direction)
    setReorderingId(null)
    if (result.success) {
      const idx = documents.findIndex((d) => d.id === id)
      if (idx < 0) return
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= documents.length) return
      setDocuments((prev) => {
        const next = [...prev]
        ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
        return next
      })
      toast.success('Order updated')
    } else {
      toast.error((result as { success: false; error: string }).error)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const result = await deleteTransparencyDocument(deleteId)
    if (result.success) {
      toast.success('Document deleted')
      setDocuments((prev) => prev.filter((d) => d.id !== deleteId))
      setDeleteId(null)
    } else {
      toast.error((result as { success: false; error: string }).error)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Documents & Reports</h2>
          <p className="text-sm text-muted-foreground">
            Add, edit, or remove documents shown on the public transparency page.
          </p>
        </div>
        <Button size="sm" onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Document
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Transparency Documents ({documents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="rounded-lg border border-dashed py-12 text-center text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p className="mb-2">No documents yet</p>
              <p className="text-sm mb-4">Add your first report or document to display on the public page.</p>
              <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Document
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="w-[140px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc, idx) => (
                  <TableRow key={doc.id}>
                    <TableCell className="py-1">
                      <div className="flex flex-col gap-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMove(doc.id, 'up')}
                          disabled={idx === 0 || reorderingId === doc.id}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMove(doc.id, 'down')}
                          disabled={idx === documents.length - 1 || reorderingId === doc.id}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      {doc.file_url && doc.file_url !== '#' ? (
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline text-primary"
                        >
                          {doc.title}
                        </a>
                      ) : (
                        <span className="font-medium">{doc.title} <span className="text-muted-foreground text-xs font-normal">(no file)</span></span>
                      )}
                    </TableCell>
                    <TableCell>{doc.document_type}</TableCell>
                    <TableCell>{doc.published_date || '—'}</TableCell>
                    <TableCell>{formatFileSize(doc.file_size_bytes)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditDocument(doc)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={showAddDialog || !!editingId} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Document' : 'Add Document'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="e.g. 2024 Annual Impact Report"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={form.document_type}
                onValueChange={(v) => setForm((p) => ({ ...p, document_type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date label</Label>
              <Input
                id="date"
                value={form.published_date}
                onChange={(e) => setForm((p) => ({ ...p, published_date: e.target.value }))}
                placeholder="e.g. January 2025, Q4 2024, Updated 2024"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">File {editingId && '(optional - leave empty to keep current)'}</Label>
              <div className="flex gap-2">
                <Input
                  id="file"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.csv"
                  onChange={handleFileChange}
                />
                {form.file && (
                  <span className="text-sm text-muted-foreground self-center">
                    {form.file.name} ({formatFileSize(form.file.size)})
                  </span>
                )}
              </div>
              {!form.file && form.fileUrl && (
                <p className="text-xs text-muted-foreground">Current file: {form.filePath.split('/').pop()}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button
              onClick={editingId ? handleSaveEdit : handleAddDocument}
              disabled={isSubmitting || isUploading}
            >
              {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isUploading ? 'Uploading…' : isSubmitting ? 'Saving…' : editingId ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the document from the transparency page and delete the file. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
