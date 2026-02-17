import { getJourneyGalleryForAdmin } from '@/app/actions/journey/manage-journey-gallery'
import { listImages } from '@/app/actions/media/list-images'
import JourneyGalleryManager from '@/components/admin/JourneyGalleryManager'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function JourneyGalleryPage() {
  const [galleryItems, journeyFolderImages] = await Promise.all([
    getJourneyGalleryForAdmin(),
    listImages('journey'),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/media">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Our Journey in Pictures</h1>
            <p className="text-muted-foreground">
              Images shown on the About page. Add from the Journey folder in Media, or reorder and edit captions.
            </p>
          </div>
        </div>
      </div>

      <JourneyGalleryManager
        key={galleryItems.map((i) => i.id).join(',')}
        initialItems={galleryItems}
        journeyFolderImages={journeyFolderImages.map(img => ({ path: img.path, url: img.url, name: img.name }))}
      />
    </div>
  )
}
