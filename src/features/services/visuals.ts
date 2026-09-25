import type { TreatmentComparison } from '@/components/services/TreatmentComparisons'
import type { MediaAsset } from '@/types/content'

const previewImage = (phase: 'before' | 'after'): MediaAsset => ({
  src: `/media/result-${phase}.svg`,
  poster: `/media/result-${phase}.svg`,
  alt: `Decorative ${phase} layout placeholder, not a patient photograph`,
  aspectRatio: 'portrait',
  placeholder: true,
})

// Replace with consented, clinically reviewed matched pairs for each treatment.
// Never substitute unrelated stock photos and describe them as treatment results.
export function treatmentComparisonPreviews(slug: string): readonly TreatmentComparison[] {
  return [1, 2, 3].map(number => ({
    id: `${slug}-preview-${number}`,
    title: `Comparison preview ${String(number).padStart(2, '0')}`,
    before: previewImage('before'),
    after: previewImage('after'),
    placeholder: true,
  }))
}
