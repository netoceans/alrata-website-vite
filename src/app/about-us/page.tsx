import type { Metadata } from 'next'
import AboutPage from '@/features/about/AboutPage'
import { contact } from '@/data/clinic'
import { siteName, siteUrl } from '@/data/site'

const title = 'About Our Dental Practice in St. Louis, MO'
const description = 'Meet the team at Alrata Art of Dentistry and learn about our patient-first approach, modern dental technology, and new-patient care in St. Louis, MO.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/about-us' },
  openGraph: {
    type: 'website',
    url: '/about-us',
    siteName,
    title,
    description,
    images: [{
      url: '/media/about/about-team.webp',
      width: 730,
      height: 530,
      alt: 'The team at Alrata Art of Dentistry in St. Louis',
    }],
  },
  twitter: { card: 'summary_large_image', title, description, images: ['/media/about/about-team.webp'] },
}

export default function Page() {
  const pageUrl = new URL('/about-us', siteUrl).href
  const clinicId = new URL('/#clinic', siteUrl).href
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': `${pageUrl}#page`,
        url: pageUrl,
        name: title,
        description,
        mainEntity: { '@id': clinicId },
        isPartOf: { '@id': `${siteUrl.href}#website` },
      },
      {
        '@type': 'Dentist',
        '@id': clinicId,
        name: siteName,
        url: siteUrl.href,
        image: new URL('/media/about/about-team.webp', siteUrl).href,
        telephone: contact.phoneHref.slice(4),
        email: contact.email,
        address: { '@type': 'PostalAddress', ...contact.postalAddress },
        medicalSpecialty: 'Dentistry',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl.href },
          { '@type': 'ListItem', position: 2, name: 'About Us', item: pageUrl },
        ],
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <AboutPage />
    </>
  )
}
