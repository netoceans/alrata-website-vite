import { Check, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react'
import { whyMedia } from '@/features/home/content'
import { contact } from '@/data/clinic'
import Reveal from '@/components/shared/Reveal'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder'

const reasons = [
  { icon: Stethoscope, title: 'Comprehensive dental services', text: 'Preventive, restorative, surgical, orthodontic, and cosmetic options are available through one clinic.' },
  { icon: Sparkles, title: 'A modern clinical setting', text: 'Care is delivered in a clean, contemporary environment designed to help patients feel at ease.' },
  { icon: ShieldCheck, title: 'Personalized care', text: 'Treatment conversations begin with your needs, your questions, and a plan you understand.' },
  { icon: Check, title: 'A skilled and caring team', text: 'The clinic emphasizes professional care, clear communication, and a personal touch.' },
]

export default function WhyChoose() {
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="site-container why-grid">
        <Reveal className="why-media">
          <MediaPlaceholder media={whyMedia} label="Dentist and patient" />
        </Reveal>
        <Reveal className="why-copy">
          <h2 id="why-title">Why patients choose Alrata.</h2>
          <div className="reason-list">
            {reasons.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon aria-hidden="true" />
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
          <a className="button button--primary" href={contact.bookingHref}>Schedule a visit</a>
        </Reveal>
      </div>
    </section>
  )
}
