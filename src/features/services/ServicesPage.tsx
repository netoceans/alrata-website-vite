import { ArrowDown, ArrowUpRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import HeroBreadcrumbs from '@/components/shared/HeroBreadcrumbs'
import OfferSection from '@/components/home/OfferSection'
import ServiceGrid from '@/components/shared/ServiceGrid'
import { allServices } from '@/data/services'
import { contact } from '@/data/clinic'
import './services.css'

export default function ServicesPage() {
  return (
    <>
      <section className="care-hero" aria-labelledby="services-page-title">
        <div className="site-container">
          <HeroBreadcrumbs currentPage='Services' />
          <div className="care-hero-layout">
            <div>
              <p className="care-eyebrow">Care for every chapter</p>
              <h1 id="services-page-title">Dental Services <span>in St. Louis, MO</span></h1>
            </div>
            <div className="care-hero-intro">
              <p>From everyday prevention to a fresh start for your smile. Explore care that puts your health, comfort, and goals first.</p>
              <a className="button button--light" href={contact.bookingHref}><CalendarDays size={18} aria-hidden="true" /> Book an appointment</a>
              <a className="care-explore" href="#all-treatments">Find your treatment <ArrowDown size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="care-hero-footnote"><span>Preventive. Restorative. Cosmetic.</span><span>One team, care made personal.</span></div>
        </div>
      </section>
      <section id="all-treatments" className="section care-catalog" aria-labelledby="treatments-title">
        <div className="site-container">
          <div className="section-heading section-heading--split">
            <div><p className="care-eyebrow">Explore our treatments</p><h2 id="treatments-title">Find the care you need.</h2></div>
            <p>Start with what matters to you. We’ll help you understand your options and decide on the next step together.</p>
          </div>
          <ServiceGrid services={allServices} />
          <div className="care-guidance">
            <div><h3>Not sure where to start?</h3><p>A conversation with our team is a good first step.</p></div>
            <Link className="text-link" href="/emergency">Need urgent dental care? <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <a className="button button--outline" href={contact.phoneHref}>Call {contact.phoneDisplay}</a>
          </div>
        </div>
      </section>
      <OfferSection backdrop="plain" />
    </>
  )
}
