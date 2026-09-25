import { notFound } from 'next/navigation'
import JsonLd from '@/components/shared/JsonLd'
import { getTeamProfile, teamProfiles } from '@/features/team/content'
import TeamProfilePage from '@/features/team/TeamProfilePage'
import { teamMetadata, teamStructuredData } from '@/features/team/seo'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return teamProfiles.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const member = getTeamProfile((await params).slug)
  if (!member) notFound()
  return teamMetadata(member)
}

export default async function Page({ params }: Props) {
  const member = getTeamProfile((await params).slug)
  if (!member) notFound()
  return <><JsonLd data={teamStructuredData(member)} /><TeamProfilePage member={member} /></>
}
