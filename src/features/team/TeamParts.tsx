import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Phone } from 'lucide-react'
import { contact } from '@/data/clinic'
import type { TeamProfile } from './content'

export function TeamPortrait({ member, eager = false, sizes }: { member: TeamProfile; eager?: boolean; sizes: string }) {
  return (
    <Image
      src={member.media.src} alt={member.media.alt} width={1000} height={1250}
      sizes={sizes} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined}
    />
  )
}

export function TeamCard({ member }: { member: TeamProfile }) {
  return (
    <article className="people-card">
      <Link href={member.href} className="people-card-link">
        <div className="people-card-photo">
          <TeamPortrait member={member} sizes="(max-width: 600px) calc(100vw - 32px), (max-width: 1328px) calc((100vw - 80px) / 2), 624px" />
          <span className="people-designation">{member.designation}</span>
          <span className="people-card-arrow" aria-hidden="true"><ArrowRight size={22} /></span>
        </div>
        <div className="people-card-heading">
          <h3>{member.shortName}</h3>
          <p>{member.role}</p>
        </div>
        <p className="people-card-summary">{member.summary}</p>
        <span className="people-profile-label">View profile <ArrowRight size={16} aria-hidden="true" /></span>
      </Link>
    </article>
  )
}

export function TeamCta() {
  return (
    <section className="people-cta" aria-labelledby="people-cta-title">
      <div className="site-container people-cta-inner">
        <div>
          <p className="people-eyebrow">We look forward to meeting you</p>
          <h2 id="people-cta-title">Your care starts<br />with a conversation.</h2>
          <p>Let’s find a time for your visit to Alrata Art of Dentistry in St. Louis.</p>
        </div>
        <div className="people-cta-actions">
          <Link className="button button--primary" href={contact.bookingHref}>Book an appointment <ArrowRight size={18} aria-hidden="true" /></Link>
          <a className="people-phone" href={contact.phoneHref}><Phone size={16} aria-hidden="true" /> {contact.phoneDisplay}</a>
        </div>
      </div>
    </section>
  )
}

export function TeamBreadcrumbs({ member }: { member?: TeamProfile }) {
  return (
    <nav className="people-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        <li><span aria-hidden="true">/</span>{member ? <Link href="/our-team">Our team</Link> : <span aria-current="page">Our team</span>}</li>
        {member && <li><span aria-hidden="true">/</span><span aria-current="page">{member.shortName}</span></li>}
      </ol>
    </nav>
  )
}
