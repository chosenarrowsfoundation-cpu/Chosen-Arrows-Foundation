import { listImages } from '@/app/actions/media/list-images'
import { getJourneyGalleryForAdmin } from '@/app/actions/journey/manage-journey-gallery'
import MediaLibrary from '@/components/admin/MediaLibrary'
import JourneyGalleryManager from '@/components/admin/JourneyGalleryManager'

export default async function MediaPage() {
  // Get images from all folders (including journey for About page gallery)
  const [campaignImages, contentImages, journeyImages, galleryItems] = await Promise.all([
    listImages('campaigns'),
    listImages('content'),
    listImages('journey'),
    getJourneyGalleryForAdmin(),
  ])

  // Flatten and combine
  const allImages = [
    ...campaignImages.map(img => ({ ...img, folder: 'campaigns' })),
    ...contentImages.map(img => ({ ...img, folder: 'content' })),
    ...journeyImages.map(img => ({ ...img, folder: 'journey' })),
  ]

  const journeyFolderImages = journeyImages.map(img => ({
    path: img.path,
    url: img.url,
    name: img.name,
  }))

  return (
    <div className="space-y-8">
      {/* Page header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
        <p className="text-muted-foreground">
          Manage all uploaded images and media files. Control which Journey images appear on the About page in the section below.
        </p>
      </header>

      {/* 1. All Media — primary: upload, search, browse */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">All Media</h2>
          <p className="text-sm text-muted-foreground">
            Upload, search, and manage images across all folders. Use the Journey folder for About page gallery images.
          </p>
        </div>
        <MediaLibrary initialImages={allImages} />
      </section>

      {/* 2. Journey gallery — curated subset for About page */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Our Journey in Pictures</h2>
          <p className="text-sm text-muted-foreground">
            Images shown on the About page. Add from the Journey folder above, then reorder and edit captions.
          </p>
        </div>
        <JourneyGalleryManager
          key={galleryItems.map((i) => i.id).join(',')}
          initialItems={galleryItems}
          journeyFolderImages={journeyFolderImages}
        />
      </section>
    </div>
  )
}
