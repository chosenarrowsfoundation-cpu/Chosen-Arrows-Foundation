/**
 * Fetches reviews from Google Places API (New) for a given Place ID.
 * API key from Settings → API & Integrations or GOOGLE_PLACES_API_KEY env.
 */

import { getIntegrationValue } from '@/lib/integration-config'
import { INTEGRATION_KEYS } from '@/lib/integration-config-keys'

export type GooglePlaceReview = {
  id: string
  name: string
  role: string
  content: string
  avatar_initials: string | null
  rating?: number
}

interface GooglePlacesReviewRaw {
  name?: string
  text?: { text: string }
  rating?: number
  authorAttribution?: {
    displayName?: string
  }
}

/**
 * Fetch place details including reviews from Google Places API (New)
 */
export async function fetchGooglePlaceReviews(
  placeId: string,
  languageCode = 'en'
): Promise<GooglePlaceReview[]> {
  const apiKey = (await getIntegrationValue(INTEGRATION_KEYS.google_places_api_key)) || process.env.GOOGLE_PLACES_API_KEY || ''
  if (!apiKey) {
    console.warn('Google Places API key not set — configure in Settings → API & Integrations or set GOOGLE_PLACES_API_KEY')
    return []
  }

  if (!placeId || placeId.trim() === '') {
    return []
  }

  try {
    const url = new URL(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`
    )
    url.searchParams.set('languageCode', languageCode)

    const res = await fetch(url.toString(), {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('Google Places API error:', res.status, errBody)
      return []
    }

    const data = await res.json()
    const reviews: GooglePlacesReviewRaw[] = data.reviews || []

    return reviews.slice(0, 6).map((r, i) => {
      const displayName = r.authorAttribution?.displayName || 'Anonymous'
      const initials = displayName
        .split(' ')
        .map((p: string) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

      return {
        id: `google-${placeId}-${i}`,
        name: displayName,
        role: 'Google Review',
        content: r.text?.text || '',
        avatar_initials: initials || null,
        rating: r.rating,
      }
    })
  } catch (error) {
    console.error('Error fetching Google Place reviews:', error)
    return []
  }
}
