import type { MetadataRoute } from 'next'
import { siteUrl } from '@/data/site'
import { allServices } from '@/data/services'
import { teamProfiles } from '@/features/team/content'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl.href },
    { url: new URL('/about-us', siteUrl).href },
    { url: new URL('/contacts-us', siteUrl).href },
    { url: new URL('/services', siteUrl).href },
    { url: new URL('/our-team', siteUrl).href },
    ...teamProfiles.map(({ href }) => ({ url: new URL(href, siteUrl).href })),
    ...allServices.map(({ href }) => ({ url: new URL(href, siteUrl).href })),
    { url: new URL('/privacy-policy', siteUrl).href },
    { url: new URL('/terms-of-service', siteUrl).href },
  ]
}
