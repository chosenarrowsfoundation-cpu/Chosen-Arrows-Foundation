'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
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
import { Upload, Star, Trash2, Edit2 } from 'lucide-react'
import { uploadImage } from '@/app/actions/media/upload-image'
import { addCampaignImage, updateCampaignImage, deleteCampaignImage } from '@/app/actions/campaigns/manage-campaign-images'
import { toast } from 'sonner'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'

interface CampaignImage {
  id: string
  image_url: string
  image_alt: string | null
  is_primary: boolean
  display_order: number
}

interface CampaignImageManagerProps {
  campaignId: string
  images: CampaignImage[]
  onImagesChange?: () => void
}

export default function CampaignImageManager({
  campaignId,
  images: initialImages,
  onImagesChange,
}: CampaignImageManagerProps) {
  const [images, setImages] = useState<CampaignImage[]>(initialImages)
  const [isUploading, setIsUploading] = useState(false)
  const [editingImage, setEditingImage] = useState<CampaignImage | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Upload to storage
      const uploadResult = await uploadImage(file, `campaigns/${campaignId}`)

      if (!uploadResult.success) {
        toast.error('Upload failed', {
          description: (uploadResult as { success: false; error: string }).error,
        })
        return
      }

      // Add to campaign
      const addResult = await addCampaignImage(
        campaignId,
        uploadResult.url,
        file.name,
        images.length === 0 // Set as primary if first image
      )

      if (addResult.success) {
        toast.success('Image uploaded', {
          description: 'Image has been added to the campaign.',
        })
        onImagesChange?.()
        // Refresh images list
        window.location.reload()
      } else {
        toast.error('Failed to add image', {
          description: (addResult as { success: false; error: string }).error,
        })
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again later.'
      toast.error('Upload failed', {
        description: message,
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    const result = await updateCampaignImage(imageId, campaignId, {
      is_primary: true,
    })

    if (result.success) {
      toast.success('Primary image updated')
      onImagesChange?.()
      window.location.reload()
    } else {
      toast.error('Failed to update', {
        description: (result as { success: false; error: string }).error,
      })
    }
  }

  const handleUpdateAlt = async (imageId: string, alt: string) => {
    const result = await updateCampaignImage(imageId, campaignId, {
      image_alt: alt,
    })

    if (result.success) {
      toast.success('Alt text updated')
      setEditingImage(null)
      onImagesChange?.()
    } else {
      toast.error('Failed to update', {
        description: (result as { success: false; error: string }).error,
      })
    }
  }

  const handleDelete = async (imageId: string, imageUrl: string) => {
    const result = await deleteCampaignImage(imageId, campaignId, imageUrl)

    if (result.success) {
      toast.success('Image deleted')
      setShowDeleteDialog(null)
      onImagesChange?.()
      window.location.reload()
    } else {
      toast.error('Failed to delete', {
        description: (result as { success: false; error: string }).error,
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-base font-semibold">Campaign Images</Label>
              <p className="text-sm text-muted-foreground">
                Upload images for this campaign. The first image will be set as primary.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Image Grid */}
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images
                .sort((a, b) => a.display_order - b.display_order)
                .map((image) => (
                  <Card key={image.id} className="relative group">
                    <div className="relative aspect-square">
                      <Image
                        src={image.image_url}
                        alt={image.image_alt || 'Campaign image'}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      {image.is_primary && (
                        <Badge className="absolute top-2 left-2">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          Primary
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!image.is_primary && (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSetPrimary(image.id)}
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setEditingImage(image)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => setShowDeleteDialog(image.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {editingImage?.id === image.id && (
                      <CardContent className="p-3 space-y-2">
                        <Input
                          defaultValue={image.image_alt || ''}
                          placeholder="Alt text"
                          onBlur={(e) => {
                            if (e.target.value !== image.image_alt) {
                              handleUpdateAlt(image.id, e.target.value)
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur()
                            }
                            if (e.key === 'Escape') {
                              setEditingImage(null)
                            }
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingImage(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-12 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">No images uploaded yet</p>
              <p className="text-sm text-muted-foreground">
                Click "Upload Image" to add campaign images
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog !== null} onOpenChange={() => setShowDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the image from the campaign. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const image = images.find(img => img.id === showDeleteDialog)
                if (image) {
                  handleDelete(image.id, image.image_url)
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
