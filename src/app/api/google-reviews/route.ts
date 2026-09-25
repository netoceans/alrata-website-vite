import 'server-only'
import { contact } from '@/data/clinic'
import { createGoogleReviewsService } from '@/lib/google-reviews'

export const dynamic = 'force-dynamic'

const getReviews = createGoogleReviewsService({
  apiKey: () => process.env.GOOGLE_PLACES_API_KEY,
  placeId: () => process.env.GOOGLE_PLACE_ID,
  clinic: {
    name: 'Alrata Art of Dentistry',
    street: '10038 Manchester',
    postalCode: contact.postalAddress.postalCode,
    address: contact.address,
  },
})

export async function GET(request: Request) {
  const headers = { 'Cache-Control': 'private, no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' }
  if (new URL(request.url).search) {
    return Response.json({ status: 'unavailable' }, { status: 400, headers })
  }
  return Response.json(await getReviews(), { headers })
}
