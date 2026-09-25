import { resultMedia } from '@/features/home/content'
import ResultsSection from '@/components/shared/ResultsSection'
import ImageComparison from '@/components/home/ImageComparison'

export default function Results() {
  return (
    <ResultsSection
      title="Treatment results, shown responsibly."
      description="Approved before-and-after photography can help patients understand potential changes while keeping expectations clear and clinical."
      categories={['Veneers', 'Whitening', 'Clear aligners']}
      disclaimer="Illustrative dental imagery only—not a matched patient result. Individual outcomes vary. Final before-and-after imagery requires patient consent and clinical review."
    >
      <ImageComparison before={resultMedia[0]} after={resultMedia[1]} />
    </ResultsSection>
  )
}
