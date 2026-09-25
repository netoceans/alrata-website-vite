import type { ReactNode } from 'react'

type LegalPageProps = {
  title: string
  effectiveDate: string
  description: ReactNode
  children: ReactNode
}

export default function LegalPage({ title, effectiveDate, description, children }: LegalPageProps) {
  return (
    <article className="legal-page">
      <header className="legal-hero">
        <div className="site-container legal-hero__inner">
          <p className="legal-eyebrow">Legal information</p>
          <h1>{title}</h1>
          <p className="legal-effective-date">Effective Date: {effectiveDate}</p>
        </div>
      </header>
      <div className="site-container legal-content">
        <div className="legal-introduction">{description}</div>
        {children}
      </div>
    </article>
  )
}
