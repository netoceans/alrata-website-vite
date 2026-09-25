import type { ReactNode } from 'react'
import Reveal from '@/components/shared/Reveal'

export default function ResultsSection({ title, description, disclaimer, categories, children, className = '' }: {
  title: string
  description: string
  disclaimer: string
  categories: readonly string[]
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`section results ${className}`.trim()} aria-labelledby="results-title">
      <div className="site-container results-grid">
        <Reveal className="results-copy">
          <h2 id="results-title">{title}</h2>
          <p>{description}</p>
          <div className="result-categories">{categories.map(category => <span key={category}>{category}</span>)}</div>
          <p className="disclaimer">{disclaimer}</p>
        </Reveal>
        <Reveal className="results-comparison">{children}</Reveal>
      </div>
    </section>
  )
}
