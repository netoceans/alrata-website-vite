import { notFound } from 'next/navigation'
import { allServices, getService } from '@/data/services'
import TreatmentPage from '@/features/services/TreatmentPage'
import { careMetadata, careStructuredData } from '@/features/services/seo'
import JsonLd from '@/components/shared/JsonLd'

type Props = { params: Promise<{ treatment: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return allServices.map(({ slug }) => ({ treatment: slug }))
}

export async function generateMetadata({ params }: Props) {
  const service = getService((await params).treatment)
  if (!service) notFound()
  return careMetadata(service)
}

export default async function Page({ params }: Props) {
  const service = getService((await params).treatment)
  if (!service) notFound()
  return <><JsonLd data={careStructuredData(service)} /><TreatmentPage treatment={service} /></>
}
