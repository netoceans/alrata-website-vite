import type { Metadata } from 'next'
import ContactPage from '@/features/contact/ContactPage'
import JsonLd from '@/components/shared/JsonLd'
import { contact } from '@/data/clinic'
import { siteName, siteUrl } from '@/data/site'

const title = 'Contact Us | Dentist in St. Louis, MO'
const description = 'Contact Alrata Art of Dentistry in St. Louis, MO. Find our phone number, email, opening hours and directions, or book your dental appointment online.'
const pageUrl = new URL('/contacts-us', siteUrl).href
const clinicId = new URL('/#clinic', siteUrl).href
const image = '/media/about/about-team.webp'

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: '/contacts-us' },
  openGraph: { type: 'website', url: '/contacts-us', siteName, title, description, images: [{ url: image, width: 730, height: 530, alt: 'The team at Alrata Art of Dentistry in St. Louis' }] },
  twitter: { card: 'summary_large_image', title, description, images: [image] },
}

export default function Page() {
  return <><JsonLd data={{
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'ContactPage', '@id': `${pageUrl}#page`, url: pageUrl, name: title, description, mainEntity: { '@id': clinicId }, isPartOf: { '@id': `${siteUrl.href}#website` } },
      { '@type': 'Dentist', '@id': clinicId, name: siteName, url: siteUrl.href, image: new URL(image, siteUrl).href, telephone: contact.phoneHref.slice(4), email: contact.email, address: { '@type': 'PostalAddress', ...contact.postalAddress }, openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: contact.openingHours.days, opens: contact.openingHours.opens, closes: contact.openingHours.closes }] },
      { '@type': 'BreadcrumbList', '@id': `${pageUrl}#breadcrumbs`, itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl.href }, { '@type': 'ListItem', position: 2, name: 'Contact Us', item: pageUrl }] },
    ],
  }} /><ContactPage /></>
}
