'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImageComparison from '@/components/home/ImageComparison'
import type { MediaAsset } from '@/types/content'

export interface TreatmentComparison {
  id: string
  title: string
  before: MediaAsset
  after: MediaAsset
  placeholder: boolean
}

export default function TreatmentComparisons({ comparisons }: { comparisons: readonly TreatmentComparison[] }) {
  const [active, setActive] = useState(0)
  const comparison = comparisons[active]
  if (!comparison) return null
  const move = (direction: number) => setActive(index => (index + direction + comparisons.length) % comparisons.length)

  return (
    <div className="treatment-comparisons" role="region" aria-label="Treatment before and after comparisons">
      <div className="treatment-comparison-heading"><p aria-live="polite" aria-atomic="true">{comparison.title}</p><span>{String(active + 1).padStart(2, '0')} / {String(comparisons.length).padStart(2, '0')}</span></div>
      <ImageComparison key={comparison.id} before={comparison.before} after={comparison.after} placeholder={comparison.placeholder} label={`${comparison.title}: before and after image comparison`} />
      <div className="treatment-comparison-controls">
        <button type="button" aria-label="Previous comparison" onClick={() => move(-1)}><ChevronLeft size={20} /></button>
        <div role="group" aria-label="Choose a comparison">
          {comparisons.map((item, index) => <button key={item.id} type="button" aria-label={`Show ${item.title.toLowerCase()}`} aria-current={active === index ? 'true' : undefined} onClick={() => setActive(index)}>{String(index + 1).padStart(2, '0')}</button>)}
        </div>
        <button type="button" aria-label="Next comparison" onClick={() => move(1)}><ChevronRight size={20} /></button>
      </div>
    </div>
  )
}
