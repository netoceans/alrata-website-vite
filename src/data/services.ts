import type { Treatment } from '@/types/content'
import { treatmentContent } from '@/features/services/content'

/** Original catalog order. Slugs preserve the existing site's treatment URLs. */
export const allServices: readonly Treatment[] = treatmentContent.map((service) => ({
  ...service,
  href: `/${service.slug}`,
  media: {
    src: `/media/services/${service.slug}.webp`,
    poster: `/media/services/${service.slug}.webp`,
    alt: service.imageAlt,
    aspectRatio: 'landscape',
    placeholder: false,
    sourceUrl: `https://alratadental.com/${service.slug}/`,
  },
}))

export function getService(slug: string): Treatment | undefined {
  return allServices.find((service) => service.slug === slug)
}

const featuredSlugs = ['dental-implants', 'oral-surgery-extraction', 'root-canal-endodontics', 'clear-aligners', 'dental-veneers', 'teeth-whitening'] as const

/** Keep the homepage and footer selection independent of catalog ordering. */
export const services = featuredSlugs.map((slug) => {
  const service = getService(slug)
  if (!service) throw new Error(`Missing featured treatment: ${slug}`)
  return service
})
