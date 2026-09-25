import type { Metadata } from 'next'
import { siteName, siteUrl } from '@/data/site'
import { contact } from '@/data/clinic'
import { leadDentist, teamDescription, teamProfiles, teamTitle, type TeamProfile } from './content'

export function teamMetadata(member?: TeamProfile): Metadata {
  const title = member?.metadata.title ?? teamTitle
  const description = member?.metadata.description ?? teamDescription
  const path = member?.href ?? '/our-team'
  const media = (member ?? leadDentist).media
  const image = { url: media.src, alt: media.alt, width: 1000, height: 1250 }
  return {
    title, description, alternates: { canonical: path },
    openGraph: { type: 'website', url: path, siteName, title, description, images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export function teamStructuredData(member?: TeamProfile) {
  const pageUrl = new URL(member?.href ?? '/our-team', siteUrl).href
  const clinicId = new URL('/#clinic', siteUrl).href
  const person = (profile: TeamProfile) => ({
    '@type': 'Person', '@id': `${new URL(profile.href, siteUrl).href}#person`,
    name: profile.name, jobTitle: profile.role, url: new URL(profile.href, siteUrl).href,
    image: new URL(profile.media.src, siteUrl).href, description: profile.summary,
    worksFor: { '@id': clinicId },
  })
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': member ? 'ProfilePage' : 'CollectionPage', '@id': `${pageUrl}#page`, url: pageUrl,
        name: member?.metadata.title ?? teamTitle,
        description: member?.metadata.description ?? teamDescription,
        breadcrumb: { '@id': `${pageUrl}#breadcrumbs` },
        mainEntity: { '@id': member ? `${pageUrl}#person` : `${pageUrl}#team` },
      },
      {
        '@type': 'BreadcrumbList', '@id': `${pageUrl}#breadcrumbs`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl.href },
          { '@type': 'ListItem', position: 2, name: 'Our team', item: new URL('/our-team', siteUrl).href },
          ...(member ? [{ '@type': 'ListItem', position: 3, name: member.name, item: pageUrl }] : []),
        ],
      },
      {
        '@type': 'Dentist', '@id': clinicId, name: siteName, url: siteUrl.href,
        telephone: contact.phoneHref.slice(4), address: { '@type': 'PostalAddress', ...contact.postalAddress },
      },
      ...(member ? [person(member)] : [
        {
          '@type': 'ItemList', '@id': `${pageUrl}#team`, name: 'The Alrata dental team',
          numberOfItems: teamProfiles.length,
          itemListElement: teamProfiles.map((profile, index) => ({
            '@type': 'ListItem', position: index + 1, item: { '@id': `${new URL(profile.href, siteUrl).href}#person` },
          })),
        },
        ...teamProfiles.map(person),
      ]),
    ],
  }
}
