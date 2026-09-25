import Image from 'next/image'
import { Check, ClipboardCheck } from 'lucide-react'
import AnimatedFaq from '@/components/about/AnimatedFaq'
import Reveal from '@/components/shared/Reveal'
import { contact } from '@/data/clinic'
import { faqs, visitChecklist, visitMedia } from '@/features/about/content'

export default function VisitInfo() {
  return (
    <section className="section about-visit" aria-labelledby="about-faq-title">
      <div className="site-container">
        <Reveal className="about-visit-heading">
          <p className="about-eyebrow">Planning your visit</p>
          <h2 id="about-faq-title">Questions before your appointment.</h2>
          <p>Clear information can make it easier to take the next step. Here are answers to questions patients often ask before visiting.</p>
        </Reveal>

        <div className="about-visit-grid">
          <Reveal>
            <AnimatedFaq faqs={faqs} phoneDisplay={contact.phoneDisplay} phoneHref={contact.phoneHref} />
          </Reveal>

          <Reveal className="about-visit-media">
            <Image fill loading="lazy" sizes="(max-width: 820px) calc(100vw - 32px), 520px" src={visitMedia.src} alt={visitMedia.alt} />
          </Reveal>
        </div>

        <Reveal className="about-checklist">
          <div className="about-checklist-icon" aria-hidden="true"><ClipboardCheck size={29} /></div>
          <div>
            <p className="about-eyebrow">Before you arrive</p>
            <h3>Checklist for your visit.</h3>
            <ul>
              {visitChecklist.map((item) => (
                <li key={item.label}><Check size={18} aria-hidden="true" /><span>{item.label}</span></li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
