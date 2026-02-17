'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
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
import { Plus, Trash2, ChevronUp, ChevronDown, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import type { JourneyGalleryRow } from '@/app/actions/journey/manage-journey-gallery'
import {
  addJourneyImage,
  updateJourneyImage,
  deleteJourneyImage,
  reorderJourneyGallery,
} from '@/app/actions/journey/manage-journey-gallery'

type JourneyFolderImage = { path: string; url: string; name: string }

interface JourneyGalleryManagerProps {
  initialItems: JourneyGalleryRow[]
  journeyFolderImages: JourneyFolderImage[]
}

const SPAN_OPTIONS = [
  { value: 'col-span-1 row-span-1', label: '1×1' },
  { value: 'col-span-2 row-span-1', label: '2×1' },
  { value: 'col-span-2 row-span-2', label: '2×2' },
]

export default function JourneyGalleryManager({
  initialItems,
  journeyFolderImages,
}: JourneyGalleryManagerProps) {
  const router = useRouter()
  const [items, setItems] = useState<JourneyGalleryRow[]>(initialItems)
  const [addOpen, setAddOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  // Add form state
  const [addPath, setAddPath] = useState('')
  const [addAlt, setAddAlt] = useState('')
  const [addSpan, setAddSpan] = useState('col-span-1 row-span-1')
  const [addSubmitting, setAddSubmitting] = useState(false)

  // Edit form state (inline)
  const [editAlt, setEditAlt] = useState('')
  const [editSpan, setEditSpan] = useState('col-span-1 row-span-1')

  const openEdit = (item: JourneyGalleryRow) => {
    setEditId(item.id)
    setEditAlt(item.alt)
    setEditSpan(item.span)
  }

  const handleAdd = async () => {
    if (!addPath) {
      toast.error('Please select an image')
      return
    }
    setAddSubmitting(true)
    try {
      const result = await addJourneyImage(addPath, addAlt, addSpan)
      if (result.success) {
        toast.success('Image added to gallery')
        setAddOpen(false)
        setAddPath('')
        setAddAlt('')
        setAddSpan('col-span-1 row-span-1')
        router.refresh()
      } else {
        toast.error((result as { success: false; error: string }).error)
      }
    } finally {
      setAddSubmitting(false)
    }
  }

  const handleUpdate = async () => {
    if (!editId) return
    const result = await updateJourneyImage(editId, { alt: editAlt, span: editSpan })
    if (result.success) {
      toast.success('Updated')
      setEditId(null)
      router.refresh()
    } else {
      toast.error('error' in result ? result.error : 'Update failed')
    }
  }

  const handleDelete = async (id: string) => {
    const result = await deleteJourneyImage(id)
    if (result.success) {
      toast.success('Removed from gallery')
      setDeleteId(null)
      router.refresh()
    } else {
      toast.error('error' in result ? result.error : 'Failed to remove')
    }
  }

  const move = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= items.length) return
    const reordered = [...items]
    ;[reordered[index], reordered[newIndex]] = [reordered[newIndex], reordered[index]]
    const orderedIds = reordered.map((i) => i.id)
    const result = await reorderJourneyGallery(orderedIds)
    if (result.success) {
      setItems(reordered)
      router.refresh()
    } else {
      toast.error('error' in result ? result.error : 'Reorder failed')
    }
  }

  // Images in journey folder that are not yet in the gallery (by path)
  const galleryPaths = new Set(items.map((i) => i.path))
  const availableToAdd = journeyFolderImages.filter((img) => !galleryPaths.has(img.path))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Order and captions here. Upload new images in Media → Journey folder, then add them below.
        </p>
        <Button onClick={() => setAddOpen(true)} disabled={availableToAdd.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Add from Journey folder
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-2">No images in the gallery yet.</p>
            <p className="text-sm text-muted-foreground">
              Upload images to the Journey folder in Media, then add them here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li key={item.id}>
              <Card>
                <CardContent className="p-4 flex flex-row items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => move(index, 'up')}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => move(index, 'down')}
                      disabled={index === items.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-muted">
                    {item.previewUrl ? (
                      <Image
                        src={item.previewUrl}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        Image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {editId === item.id ? (
                      <div className="flex flex-wrap gap-2 items-end">
                        <div className="grid gap-1.5 flex-1 min-w-[200px]">
                          <Label>Caption</Label>
                          <Input
                            value={editAlt}
                            onChange={(e) => setEditAlt(e.target.value)}
                            placeholder="Alt text"
                          />
                        </div>
                        <div className="w-[100px]">
                          <Label>Size</Label>
                          <Select value={editSpan} onValueChange={setEditSpan}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {SPAN_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button size="sm" onClick={handleUpdate}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <p className="font-medium truncate">{item.alt || '(no caption)'}</p>
                        <p className="text-xs text-muted-foreground">{item.span}</p>
                      </>
                    )}
                  </div>
                  {editId !== item.id && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}

      {/* Add from Journey folder */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Journey gallery</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Image from Journey folder</Label>
              <Select value={addPath} onValueChange={setAddPath}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an image" />
                </SelectTrigger>
                <SelectContent>
                  {availableToAdd.map((img) => (
                    <SelectItem key={img.path} value={img.path}>
                      {img.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Caption (alt text)</Label>
              <Input
                value={addAlt}
                onChange={(e) => setAddAlt(e.target.value)}
                placeholder="e.g. Our children together"
              />
            </div>
            <div className="grid gap-2">
              <Label>Grid size</Label>
              <Select value={addSpan} onValueChange={setAddSpan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SPAN_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={addSubmitting}>
              {addSubmitting ? 'Adding…' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from gallery?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the image from the About page gallery. The file stays in the media library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteId && handleDelete(deleteId)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
