import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CalendarDays, Phone } from 'lucide-react'
import Breadcrumbs from '@/components/services/Breadcrumbs'
import ServiceGrid from '@/components/shared/ServiceGrid'
import GoogleReviews from '@/components/home/GoogleReviews'
import TreatmentGallery from '@/components/services/TreatmentGallery'
import { clinicImage } from '@/data/media'
import ResultsSection from '@/components/shared/ResultsSection'
import TreatmentComparisons from '@/components/services/TreatmentComparisons'
import { treatmentComparisonPreviews } from '@/features/services/visuals'
import { contact } from '@/data/clinic'
import { allServices } from '@/data/services'
import type { Treatment } from '@/types/content'
import './services.css'

export default function TreatmentPage({ treatment }: { treatment: Treatment }) {
  const emergency = treatment.slug === 'emergency'
  const related = treatment.relatedSlugs.flatMap((slug) => allServices.filter((service) => service.slug === slug))

  return (
    <>
      <section className="care-hero treatment-hero" aria-labelledby="treatment-title">
        <div className="site-container">
          <Breadcrumbs treatment={treatment.name} />
          <div className="treatment-hero-layout">
            <div className="treatment-hero-copy">
              <p className="care-eyebrow">{treatment.category}</p>
              <h1 id="treatment-title">{treatment.name}{' '}<span>in St. Louis, MO</span></h1>
              <p className="treatment-lead">{treatment.introduction}</p>
              <a className="button button--light" href={emergency ? contact.phoneHref : contact.bookingHref}>
                {emergency ? <Phone size={18} aria-hidden="true" /> : <CalendarDays size={18} aria-hidden="true" />}
                {emergency ? `Call ${contact.phoneDisplay}` : 'Book an appointment'}
              </a>
            </div>
            <div className="treatment-hero-image">
              <Image fill src={treatment.media.src ?? treatment.media.poster} alt={treatment.media.alt}
                sizes="(max-width: 960px) calc(100vw - 48px), (max-width: 1328px) 43vw, 550px" loading="eager" fetchPriority="high" />
            </div>
          </div>
        </div>
      </section>
      <GoogleReviews />
      <div className="section treatment-body site-container">
        <aside className="treatment-sidebar">
          <nav aria-label="On this page">
            <p className="care-eyebrow">In this guide</p>
            <ol>{treatment.sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`}><span aria-hidden="true">0{index + 1}</span>{section.title}</a></li>)}</ol>
          </nav>
          <p>Questions about your care?<br /><a className="text-link" href={contact.phoneHref}>{contact.phoneDisplay}</a></p>
        </aside>
        <div className="treatment-article">
          {treatment.sections.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <p className="treatment-section-number" aria-hidden="true">0{index + 1} / {treatment.category}</p>
              <h2 id={`${section.id}-title`}>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
            </section>
          ))}
          {treatment.reference && <p className="treatment-reference"><a href={treatment.reference.href}>{treatment.reference.label} <ArrowRight size={15} aria-hidden="true" /></a></p>}
        </div>
      </div>
      <TreatmentGallery treatmentName={treatment.name} images={[
        { id: treatment.slug, media: treatment.media, caption: `A closer look at ${treatment.name.toLowerCase()}` },
        { id: 'chairside', media: clinicImage('/media/about/chairside-care.webp', 'A dentist speaking with a patient beside digital dental X-rays'), caption: 'A conversation about your care' },
        { id: 'practice', media: clinicImage('/media/about/about-team.webp', 'The team at Alrata Art of Dentistry'), caption: 'The people behind your care' },
      ]} />
      <ResultsSection className="treatment-results" title="Before & after. A closer look."
        description="Use the slider to explore each comparison, or choose another preview below."
        categories={[treatment.name]}
        disclaimer="Layout previews only. These illustrations are not patient photographs or evidence of treatment outcomes. Approved, matched before-and-after images will replace these previews. Individual results vary."
      >
        <TreatmentComparisons comparisons={treatmentComparisonPreviews(treatment.slug)} />
      </ResultsSection>
      <section className="section treatment-related" aria-labelledby="related-title">
        <div className="site-container">
          <div className="section-heading section-heading--split"><div><p className="care-eyebrow">See the possibilities</p><h2 id="related-title">Explore related care.</h2></div><Link className="text-link" href="/services">All services <ArrowRight size={18} aria-hidden="true" /></Link></div>
          <ServiceGrid services={related} />
        </div>
      </section>
      <section className="treatment-cta" aria-labelledby="treatment-cta-title">
        <div className="site-container treatment-cta-inner">
          <div><p className="care-eyebrow">Your next step</p><h2 id="treatment-cta-title">{emergency ? 'Let’s talk about what you need.' : 'Let’s make a plan for your smile.'}</h2><p>{emergency ? 'Call to describe your symptoms and confirm appointment availability.' : 'Bring your questions. We’ll help you understand your options and choose your next step.'}</p></div>
          <div className="treatment-cta-actions">
            <a className="button button--light" href={emergency ? contact.phoneHref : contact.bookingHref}>{emergency ? <Phone size={18} aria-hidden="true" /> : <CalendarDays size={18} aria-hidden="true" />}{emergency ? `Call ${contact.phoneDisplay}` : 'Book an appointment'}</a>
            {!emergency && <a className="text-link text-link--inverse" href={contact.phoneHref}>{contact.phoneDisplay}</a>}
          </div>
        </div>
      </section>
    </>
  )
}
