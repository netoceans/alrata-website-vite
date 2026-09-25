import type { Metadata } from 'next'
import HomePage from '@/features/home/HomePage'
import { contact } from '@/data/clinic'
import { doctorProfile } from '@/features/home/content'
import { siteDescription, siteName, siteTitle, siteUrl } from '@/data/site'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', siteName, title: siteTitle, description: siteDescription },
}

export default function Page() {
  const clinicId = new URL('/#clinic', siteUrl).href
  const doctorId = `${new URL(doctorProfile.href, siteUrl).href}#person`
  const clinic = {
    '@type': 'Dentist', '@id': clinicId,
    name: siteName, url: siteUrl.href, telephone: contact.phoneHref.slice(4), email: contact.email,
    address: { '@type': 'PostalAddress', ...contact.postalAddress },
    medicalSpecialty: 'Dentistry',
  }
  const doctor = {
    '@type': 'Person', '@id': doctorId,
    name: doctorProfile.name,
    url: new URL(doctorProfile.href, siteUrl).href,
    image: new URL(doctorProfile.media.src, siteUrl).href,
    jobTitle: 'Dentist',
    worksFor: { '@id': clinicId },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'UCLA School of Dentistry' },
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: 'Board certification',
      name: 'American Board of Operative Dentistry',
    },
    knowsAbout: ['Esthetic dentistry', 'Restorative dentistry'],
    award: 'Recognized as a top dentist nationwide by the PDS organization in 2023',
  }
  const structuredData = { '@context': 'https://schema.org', '@graph': [clinic, doctor] }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <HomePage />
    </>
  )
}
