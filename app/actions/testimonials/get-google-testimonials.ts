'use server'

import { getSetting } from '@/app/actions/settings/get-settings'
import { fetchGooglePlaceReviews } from '@/lib/google-places'

export type GoogleTestimonial = {
  id: string
  name: string
  role: string
  content: string
  avatar_initials: string | null
}

/**
 * Gets testimonials from Google Business Profile based on site settings.
 * Returns empty array if not configured or API fails.
 */
export async function getGoogleTestimonials(
  languageCode = 'en'
): Promise<GoogleTestimonial[]> {
  const config = await getSetting('testimonials_config')
  if (!config?.enabled || !config?.google_place_id?.trim()) {
    return []
  }

  const reviews = await fetchGooglePlaceReviews(
    config.google_place_id.trim(),
    languageCode
  )

  return reviews.map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    content: r.content,
    avatar_initials: r.avatar_initials,
  }))
}
