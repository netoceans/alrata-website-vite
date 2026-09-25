import JsonLd from '@/components/shared/JsonLd'
import TeamPage from '@/features/team/TeamPage'
import { teamMetadata, teamStructuredData } from '@/features/team/seo'

export const metadata = teamMetadata()

export default function Page() {
  return <><JsonLd data={teamStructuredData()} /><TeamPage /></>
}
