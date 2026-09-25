import { CalendarDays, Phone } from 'lucide-react'
import { contact } from '@/data/clinic'

export default function FinalCTA() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="site-container final-cta-grid">
        <div>
          <h2 id="final-cta-title">Your next visit can start with a conversation.</h2>
          <p>Book online or call the clinic. The team will help you understand the next step.</p>
        </div>
        <div className="final-actions">
          <a className="button button--primary" href={contact.bookingHref}><CalendarDays size={18} /> Book your appointment</a>
          <a className="text-link" href={contact.phoneHref}><Phone size={17} /> {contact.phoneDisplay}</a>
        </div>
      </div>
    </section>
  )
}
