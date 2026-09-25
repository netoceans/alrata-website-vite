import Image from 'next/image'
import HeroBreadcrumbs from '@/components/shared/HeroBreadcrumbs'
import { ArrowDown, CalendarDays, MapPin } from 'lucide-react'
import { contact } from '@/data/clinic'
import { aboutHero } from '@/features/about/content'

export default function AboutHero() {
  return (
    <section className="about-hero" aria-labelledby="about-page-title">
      <svg className="about-hero-lines" viewBox="0 0 620 270" fill="none" aria-hidden="true">
        <path d="M15 230C148 91 275 295 392 130C456 40 519 58 605 18" stroke="currentColor" strokeWidth="2" />
        <path d="M36 248C155 126 279 303 414 151C479 79 531 66 612 42" stroke="currentColor" />
      </svg>
      <div className="site-container">
        <HeroBreadcrumbs currentPage='About us' />
        <div className="about-hero-copy">
          <p className="about-hero-eyebrow">{aboutHero.eyebrow}</p>
          <h1 id="about-page-title">About Alrata <span>Art of Dentistry</span></h1>
          <p className="about-hero-lead">{aboutHero.lead}</p>
          <div className="about-hero-actions">
            <a className="button button--light" href={contact.bookingHref}>
              <CalendarDays size={18} aria-hidden="true" /> Book an appointment
            </a>
            <a className="text-link text-link--inverse" href="#our-practice">
              Discover our approach <ArrowDown size={17} aria-hidden="true" />
            </a>
          </div>
          <p className="about-hero-location">
            <MapPin size={17} aria-hidden="true" /> Serving patients in St. Louis, Missouri
          </p>
        </div>

        <figure className="about-hero-portrait">
          <div className="about-hero-media">
          <Image
            fill
            fetchPriority="high"
            loading="eager"
            sizes="(max-width: 960px) calc(100vw - 32px), 640px"
            src={aboutHero.media.src}
            alt={aboutHero.media.alt}
          />
          </div>
          <figcaption className="about-hero-caption">
            <span className="about-hero-caption-line" aria-hidden="true" />
            <div>
              <p>The people behind your care</p>
              <small>Alrata Art of Dentistry · St. Louis, MO</small>
            </div>
          </figcaption>
        </figure>
        <ul className="about-hero-principles" aria-label="Our approach to care">
          <li><span aria-hidden="true">01</span> Personal attention</li>
          <li><span aria-hidden="true">02</span> Clear guidance</li>
          <li><span aria-hidden="true">03</span> Your comfort first</li>
        </ul>
      </div>
    </section>
  )
}
