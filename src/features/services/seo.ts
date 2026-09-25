import type { Metadata } from 'next'
import { siteName, siteUrl } from '@/data/site'
import { contact } from '@/data/clinic'
import { allServices } from '@/data/services'
import type { Treatment } from '@/types/content'

export const servicesTitle = 'Dental Services in St. Louis, MO'
export const servicesDescription = 'Explore preventive, restorative, and cosmetic dental care at Alrata Art of Dentistry in St. Louis, MO. Find treatments and book your consultation.'

export function careMetadata(treatment?: Treatment): Metadata {
  const title = treatment ? `${treatment.name} in St. Louis, MO` : servicesTitle
  const description = treatment ? `${treatment.description} Visit Alrata Art of Dentistry in St. Louis, MO.` : servicesDescription
  const path = treatment?.href ?? '/services'
  const image = treatment?.media.src ?? '/media/about/about-team.webp'
  return {
    title, description,
    alternates: { canonical: path },
    openGraph: { type: 'website', url: path, siteName, title, description, images: [{ url: image, alt: treatment?.media.alt ?? 'The Alrata Art of Dentistry team in St. Louis' }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export function careStructuredData(treatment?: Treatment) {
  const pageUrl = new URL(treatment?.href ?? '/services', siteUrl).href
  const clinicId = new URL('/#clinic', siteUrl).href
  const breadcrumbs = [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl.href },
    { '@type': 'ListItem', position: 2, name: 'Services', item: new URL('/services', siteUrl).href },
    ...(treatment ? [{ '@type': 'ListItem', position: 3, name: treatment.name, item: pageUrl }] : []),
  ]
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': treatment ? 'WebPage' : 'CollectionPage', '@id': `${pageUrl}#page`, url: pageUrl,
        name: treatment ? `${treatment.name} in St. Louis, MO` : servicesTitle,
        description: treatment?.description ?? servicesDescription,
        breadcrumb: { '@id': `${pageUrl}#breadcrumbs` },
        mainEntity: { '@id': `${pageUrl}#${treatment ? 'service' : 'treatments'}` },
      },
      { '@type': 'BreadcrumbList', '@id': `${pageUrl}#breadcrumbs`, itemListElement: breadcrumbs },
      {
        '@type': 'Dentist', '@id': clinicId, name: siteName, url: siteUrl.href,
        telephone: contact.phoneHref.slice(4), address: { '@type': 'PostalAddress', ...contact.postalAddress },
      },
      treatment ? {
        '@type': 'Service', '@id': `${pageUrl}#service`, name: treatment.name,
        description: treatment.description, url: pageUrl, provider: { '@id': clinicId },
        areaServed: { '@type': 'City', name: 'St. Louis' },
      } : {
        '@type': 'ItemList', '@id': `${pageUrl}#treatments`, name: 'Dental services', numberOfItems: allServices.length,
        itemListElement: allServices.map((service, index) => ({ '@type': 'ListItem', position: index + 1, name: service.name, url: new URL(service.href, siteUrl).href })),
      },
    ],
  }
}
