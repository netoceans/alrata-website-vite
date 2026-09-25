import { expect, test } from '@playwright/test'
import { createGoogleReviewsService } from '../src/lib/google-reviews'

const clinic = { name: 'Alrata Art of Dentistry', street: '10038 Manchester', postalCode: '63122', address: '10038 Manchester Rd #226, St. Louis, MO 63122' }
const place = { id: 'clinic-id', displayName: { text: clinic.name }, formattedAddress: clinic.address }
const review = {
  name: 'places/clinic-id/reviews/1', authorAttribution: { displayName: 'Test reviewer', uri: 'https://www.google.com/maps/contrib/1', photoUri: 'https://lh3.googleusercontent.com/test' },
  rating: 2, originalText: { text: 'Original test review' }, text: { text: 'Translated test review' },
  publishTime: '2026-09-01T00:00:00Z', relativePublishTimeDescription: '2 weeks ago', googleMapsUri: 'https://www.google.com/maps/reviews/1',
}
const details = { rating: 4.7, userRatingCount: 82, googleMapsUri: 'https://www.google.com/maps/place/test', reviews: [review], attributions: [{ provider: 'Test provider', providerUri: 'https://example.com/provider' }] }
const options = { apiKey: () => 'test-secret-never-public', placeId: () => undefined, clinic }

test('missing key does not contact Google', async () => {
  const fetcher: typeof fetch = async () => { throw new Error('Must not fetch') }
  expect(await createGoogleReviewsService({ ...options, apiKey: () => undefined, fetcher })()).toEqual({ status: 'unavailable' })
})

test('resolves once, fetches fresh reviews, preserves attribution and lower ratings', async () => {
  const calls: { url: string; init?: RequestInit }[] = []
  const fetcher: typeof fetch = async (input, init) => {
    calls.push({ url: String(input), init })
    return Response.json(String(input).endsWith('searchText') ? { places: [place] } : details)
  }
  const get = createGoogleReviewsService({ ...options, fetcher })
  const result = await get()
  await get()
  expect(calls.filter(({ url }) => url.endsWith('searchText'))).toHaveLength(1)
  expect(calls.filter(({ url }) => !url.endsWith('searchText'))).toHaveLength(2)
  expect(calls.every(({ init }) => init?.cache === 'no-store' && init?.signal)).toBeTruthy()
  expect(result).toMatchObject({ status: 'available', rating: 4.7, reviewCount: 82,
    reviews: [{ author: 'Test reviewer', rating: 2, text: 'Original test review', avatarUrl: review.authorAttribution.photoUri, authorUrl: review.authorAttribution.uri, url: review.googleMapsUri }],
    attributions: [{ name: 'Test provider', url: 'https://example.com/provider' }] })
  expect(JSON.stringify(result)).not.toContain('test-secret')
})

test('exact Place ID override skips lookup and limits reviews to five in order', async () => {
  const fetcher: typeof fetch = async (input) => {
    expect(String(input)).toContain('/places/explicit-id?')
    return Response.json({ ...details, reviews: Array.from({ length: 6 }, (_, i) => ({ ...review, name: `review-${i}`, rating: i % 5 + 1 })) })
  }
  const result = await createGoogleReviewsService({ ...options, placeId: () => 'explicit-id', fetcher })()
  expect(result.status === 'available' && result.reviews.map((item) => item.rating)).toEqual([1, 2, 3, 4, 5])
})

for (const [name, places] of [
  ['ambiguous', [place, { ...place, id: 'other-id' }]],
  ['wrong name', [{ ...place, displayName: { text: 'Another practice' } }]],
  ['wrong address', [{ ...place, formattedAddress: '100 Manchester Rd, St. Louis, MO 63122' }]],
  ['empty', []],
] as const) {
  test(`${name} lookup fails closed`, async () => {
    let calls = 0
    const fetcher: typeof fetch = async () => { calls++; return Response.json({ places }) }
    expect(await createGoogleReviewsService({ ...options, fetcher })()).toEqual({ status: 'unavailable' })
    expect(calls).toBe(1)
  })
}

for (const [name, body] of [
  ['empty reviews', { ...details, reviews: [] }],
  ['invalid aggregate', { ...details, rating: '5' }],
  ['invalid count', { ...details, userRatingCount: -1 }],
  ['missing author', { ...details, reviews: [{ ...review, authorAttribution: {} }] }],
  ['unsafe source', { ...details, reviews: [{ ...review, googleMapsUri: 'javascript:alert(1)' }] }],
  ['invalid date', { ...details, reviews: [{ ...review, publishTime: 'not-a-date' }] }],
] as const) {
  test(`${name} produces the public fallback`, async () => {
    const fetcher: typeof fetch = async () => Response.json(body)
    expect(await createGoogleReviewsService({ ...options, placeId: () => 'id', fetcher })()).toEqual({ status: 'unavailable' })
  })
}

for (const status of [403, 429, 500]) {
  test(`Google ${status} is sanitized without retry`, async () => {
    let calls = 0
    const fetcher: typeof fetch = async () => { calls++; return new Response('sensitive upstream error', { status }) }
    expect(await createGoogleReviewsService({ ...options, fetcher })()).toEqual({ status: 'unavailable' })
    expect(calls).toBe(1)
  })
}

test('deadline aborts an unresponsive upstream', async () => {
  const fetcher: typeof fetch = async (_input, init) => new Promise((_resolve, reject) => {
    init?.signal?.addEventListener('abort', () => reject(new Error('timeout')), { once: true })
  })
  expect(await createGoogleReviewsService({ ...options, fetcher, timeoutMs: 10 })()).toEqual({ status: 'unavailable' })
})

test('malformed JSON is sanitized', async () => {
  const fetcher: typeof fetch = async () => new Response('not json')
  expect(await createGoogleReviewsService({ ...options, fetcher })()).toEqual({ status: 'unavailable' })
})
