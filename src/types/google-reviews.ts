export interface GoogleReview {
  id: string
  author: string
  authorUrl?: string
  avatarUrl?: string
  rating: number
  text: string
  publishedAt: string
  relativeDate: string
  url: string
}

export type GoogleReviewsResponse =
  | { status: 'unavailable' }
  | {
      status: 'available'
      rating: number
      reviewCount: number
      url: string
      reviews: GoogleReview[]
      attributions: { name: string; url?: string }[]
    }
