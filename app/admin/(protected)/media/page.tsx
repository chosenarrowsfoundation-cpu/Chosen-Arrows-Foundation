import { listImages } from '@/app/actions/media/list-images'
import MediaLibrary from '@/components/admin/MediaLibrary'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ImageIcon } from 'lucide-react'

export default async function MediaPage() {
  // Get images from all folders (including journey for About page gallery)
  const [campaignImages, contentImages, journeyImages] = await Promise.all([
    listImages('campaigns'),
    listImages('content'),
    listImages('journey'),
  ])

  // Flatten and combine
  const allImages = [
    ...campaignImages.map(img => ({ ...img, folder: 'campaigns' })),
    ...contentImages.map(img => ({ ...img, folder: 'content' })),
    ...journeyImages.map(img => ({ ...img, folder: 'journey' })),
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">
            Manage all uploaded images and media files. Use the Journey gallery to control which images appear on the About page.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/journey-gallery">
            <ImageIcon className="mr-2 h-4 w-4" />
            Our Journey in Pictures
          </Link>
        </Button>
      </div>

      <MediaLibrary initialImages={allImages} />
    </div>
  )
}
