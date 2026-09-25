import type { GoogleReview, GoogleReviewsResponse } from '@/types/google-reviews'

type RecordValue = Record<string, unknown>
const record = (value: unknown): RecordValue =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as RecordValue : {}
const string = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '')
const validRating = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 5

function safeUrl(value: unknown): string | undefined {
  try {
    const url = new URL(string(value))
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined
  } catch { return undefined }
}

function parseReview(value: unknown): GoogleReview | undefined {
  const review = record(value)
  const author = record(review.authorAttribution)
  const name = string(author.displayName)
  const url = safeUrl(review.googleMapsUri)
  const date = string(review.publishTime)
  // Use the original text so no translated content is presented as the author's words.
  const text = string(record(review.originalText).text) || string(record(review.text).text)
  if (!name || !url || !validRating(review.rating) || !date || !Number.isFinite(Date.parse(date))) return
  return {
    id: string(review.name) || url,
    author: name,
    authorUrl: safeUrl(author.uri),
    avatarUrl: safeUrl(author.photoUri),
    rating: review.rating,
    text,
    publishedAt: new Date(date).toISOString(),
    relativeDate: string(review.relativePublishTimeDescription),
    url,
  }
}

interface ServiceOptions {
  apiKey: () => string | undefined
  placeId: () => string | undefined
  clinic: { name: string; street: string; postalCode: string; address: string }
  fetcher?: typeof fetch
  timeoutMs?: number
}

/** Server adapter; credentials are supplied only by the route, never by the client. */
export function createGoogleReviewsService({ apiKey, placeId, clinic, fetcher = fetch, timeoutMs = 6000 }: ServiceOptions) {
  // Only the Place ID is retained. Reviews, ratings, and author data are never cached.
  let resolvedId: string | undefined
  let resolvingId: Promise<string | undefined> | undefined

  async function request(path: string, fields: string, key: string, signal: AbortSignal, body?: object): Promise<RecordValue> {
    const response = await fetcher(`https://places.googleapis.com/v1/${path}`, {
      method: body ? 'POST' : 'GET',
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': fields, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      ...(body ? { body: JSON.stringify(body) } : {}),
      cache: 'no-store',
      signal,
    })
    if (!response.ok) throw new Error('Google reviews unavailable')
    return record(await response.json())
  }

  async function resolveId(key: string, signal: AbortSignal): Promise<string | undefined> {
    const result = await request('places:searchText', 'places.id,places.displayName,places.formattedAddress', key, signal, {
      textQuery: `${clinic.name}, ${clinic.address}`, languageCode: 'en', regionCode: 'US',
    })
    if (!Array.isArray(result.places)) return
    const matches = result.places.map(record).filter((place) => {
      const name = normalize(string(record(place.displayName).text))
      const address = normalize(string(place.formattedAddress))
      return name === normalize(clinic.name) && address.includes(normalize(clinic.street)) && address.includes(clinic.postalCode)
    })
    if (matches.length === 1) return string(matches[0].id) || undefined
  }

  return async function getReviews(): Promise<GoogleReviewsResponse> {
    const key = apiKey()?.trim()
    if (!key) return { status: 'unavailable' }
    const signal = AbortSignal.timeout(timeoutMs)
    try {
      let id = placeId()?.trim() || resolvedId
      if (!id) {
        resolvingId ??= resolveId(key, signal).finally(() => { resolvingId = undefined })
        id = await resolvingId
        if (id) resolvedId = id
      }
      if (!id) return { status: 'unavailable' }
      const result = await request(`places/${encodeURIComponent(id)}?languageCode=en`,
        'rating,userRatingCount,googleMapsUri,reviews,attributions', key, signal)
      const url = safeUrl(result.googleMapsUri)
      if (!url || !validRating(result.rating) || !Number.isSafeInteger(result.userRatingCount) || (result.userRatingCount as number) < 1) {
        return { status: 'unavailable' }
      }
      const reviews = Array.isArray(result.reviews) ? result.reviews.slice(0, 5).map(parseReview) : []
      // A malformed review must not silently change the selection shown to visitors.
      if (!reviews.length || reviews.some((review) => !review)) return { status: 'unavailable' }
      const attributions = Array.isArray(result.attributions) ? result.attributions.map((value) => {
        const item = record(value)
        return { name: string(item.provider), url: safeUrl(item.providerUri) }
      }).filter((item) => item.name) : []
      return { status: 'available', rating: result.rating, reviewCount: result.userRatingCount as number,
        url, reviews: reviews as GoogleReview[], attributions }
    } catch {
      // Do not send upstream errors (which may contain credentials) to the browser or logs.
      return { status: 'unavailable' }
    }
  }
}
