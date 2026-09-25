import { ArrowRight, Clock3, Mail, MapPin, Phone } from 'lucide-react'
import HeroBreadcrumbs from '@/components/shared/HeroBreadcrumbs'
import LocationMap from '@/components/shared/LocationMap'
import { contact } from '@/data/clinic'
import ContactForm from './ContactForm'
import './contact.css'

export default function ContactPage() {
  return (
    <div className='contact-page'>
      <section className='contact-hero' aria-labelledby='contact-title'>
        <svg className='contact-hero-lines' viewBox='0 0 620 270' fill='none' aria-hidden='true'><path d='M15 230C148 91 275 295 392 130C456 40 519 58 605 18' stroke='currentColor' strokeWidth='2' /><path d='M36 248C155 126 279 303 414 151C479 79 531 66 612 42' stroke='currentColor' /></svg>
        <div className='site-container'>
          <HeroBreadcrumbs currentPage='Contact us' />
          <div className='contact-hero-grid'>
            <div><p className='contact-eyebrow'>Alrata Art of Dentistry · St. Louis</p><h1 id='contact-title'>Contact <span>us.</span></h1></div>
            <div className='contact-hero-copy'><p>Contact us easily online, by phone or by dropping in.</p><div className='contact-actions'><a className='button button--light' href={contact.bookingHref}>Book online <ArrowRight size={18} aria-hidden='true' /></a><a className='contact-hero-phone' href={contact.phoneHref}><Phone size={17} aria-hidden='true' />{contact.phoneDisplay}</a></div></div>
          </div>
        </div>
      </section>

      <section className='contact-details' aria-label='Clinic contact details'>
        <div className='site-container contact-details-grid'>
          <div className='contact-detail'><MapPin aria-hidden='true' /><div><h2>Visit us</h2><address><a href={contact.mapHref} target='_blank' rel='noopener noreferrer'>{contact.address}, United States</a></address></div></div>
          <div className='contact-detail'><Clock3 aria-hidden='true' /><div><h2>Opening hours</h2><p>{contact.openingHours.display}</p></div></div>
          <div className='contact-detail'><Phone aria-hidden='true' /><div><h2>Call us</h2><a href={contact.phoneHref}>{contact.phoneDisplay}</a></div></div>
          <div className='contact-detail'><Mail aria-hidden='true' /><div><h2>Get in touch</h2><a href={`mailto:${contact.email}`}>{contact.email}</a></div></div>
        </div>
      </section>

      <section className='section contact-enquiry' aria-labelledby='contact-enquiry-title'>
        <div className='site-container contact-enquiry-grid'>
          <div className='contact-enquiry-copy'><p className='contact-eyebrow'>Ask us anything</p><h2 id='contact-enquiry-title'>We’re here<br />to help.</h2><p>Have a question? Just send our admin team a message and we’ll get back to you as quickly as possible.</p><p className='contact-availability'>Prefer to speak with us? Please call or email the clinic.</p><div className='contact-enquiry-links'><a href={contact.phoneHref}><Phone size={18} aria-hidden='true' />{contact.phoneDisplay}</a><a href={`mailto:${contact.email}`}><Mail size={18} aria-hidden='true' />{contact.email}</a><a className='text-link' href={contact.bookingHref}>Book online <ArrowRight size={17} aria-hidden='true' /></a></div><div className='contact-note'><span aria-hidden='true' /><p>A personal approach.<br />From your very first conversation.</p></div></div>
          <ContactForm />
        </div>
      </section>

      <section className='section contact-location' aria-labelledby='contact-location-title'>
        <div className='site-container'><div className='contact-location-heading'><div><p className='contact-eyebrow'>Find your way here</p><h2 id='contact-location-title'>Our location.</h2><address>{contact.address}, United States</address></div><a className='button button--outline' href={contact.mapHref} target='_blank' rel='noopener noreferrer'>Get directions <ArrowRight size={18} aria-hidden='true' /></a></div><LocationMap variant='large' /></div>
      </section>
    </div>
  )
}
