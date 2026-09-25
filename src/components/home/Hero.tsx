import { ArrowDown, ArrowRight, MapPin, Phone } from 'lucide-react'
import { contact } from '@/data/clinic'
import HeroVideo from './HeroVideo'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <HeroVideo />
      <svg className="hero-brush" viewBox="0 0 620 270" fill="none" aria-hidden="true">
        <path d="M15 230C148 91 275 295 392 130C456 40 519 58 605 18" stroke="currentColor" strokeWidth="2" />
        <path d="M36 248C155 126 279 303 414 151C479 79 531 66 612 42" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <h1>Dental care that makes room for confidence.</h1>
          <p>
            Modern dentistry in St. Louis, delivered with clear guidance, personal attention, and respect for your comfort.
          </p>
          <div className="hero-actions">
            <a className="button button--light" href={contact.bookingHref}>Book an appointment <ArrowRight size={18} /></a>
            <a className="text-link text-link--inverse" href="#services">Explore our services <ArrowDown size={17} /></a>
          </div>
          <div className="hero-trust" aria-label="Clinic details">
            <span><MapPin size={17} /> St. Louis, Missouri</span>
            <span><Phone size={17} /> {contact.phoneDisplay}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
