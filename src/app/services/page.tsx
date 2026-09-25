import ServicesPage from '@/features/services/ServicesPage'
import { careMetadata, careStructuredData } from '@/features/services/seo'
import JsonLd from '@/components/shared/JsonLd'

export const metadata = careMetadata()

export default function Page() {
  return <><JsonLd data={careStructuredData()} /><ServicesPage /></>
}
