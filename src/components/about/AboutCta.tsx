import Image from 'next/image'
import { CalendarDays, Phone } from 'lucide-react'
import Reveal from '@/components/shared/Reveal'
import { contact } from '@/data/clinic'
import { aboutCta } from '@/features/about/content'

export default function AboutCta() {
  return (
    <section className="section about-cta" aria-labelledby="about-cta-title">
      <div className="site-container">
        <Reveal className="about-cta-card">
          <div className="about-cta-copy">
            <p className="about-eyebrow">Your next step</p>
            <h2 id="about-cta-title">{aboutCta.title}</h2>
            <p>{aboutCta.description}</p>
            <div className="about-cta-actions">
              <a className="button button--primary" href={contact.bookingHref}>
                <CalendarDays size={18} aria-hidden="true" /> Book an appointment
              </a>
              <a className="text-link" href={contact.phoneHref}>
                <Phone size={17} aria-hidden="true" /> {contact.phoneDisplay}
              </a>
            </div>
          </div>
          <div className="about-cta-media">
            <Image fill loading="lazy" sizes="(max-width: 820px) calc(100vw - 32px), 50vw" src={aboutCta.media.src} alt={aboutCta.media.alt} />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
