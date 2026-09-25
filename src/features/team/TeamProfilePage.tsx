import Link from 'next/link'
import { ArrowLeft, ArrowRight, Clock3, Phone } from 'lucide-react'
import { contact } from '@/data/clinic'
import { teamProfiles, type TeamProfile } from './content'
import { TeamBreadcrumbs, TeamCta, TeamPortrait } from './TeamParts'
import './team.css'

export default function TeamProfilePage({ member }: { member: TeamProfile }) {
  return (
    <div className="people-page">
      <section className="person-hero" aria-labelledby="person-title">
        <div className="site-container">
          <TeamBreadcrumbs member={member} />
          <div className="person-hero-grid">
            <div className="person-hero-copy">
              <p className="people-eyebrow">{member.role} · {member.designation}</p>
              <h1 id="person-title">{member.name}</h1>
              <p className="person-introduction">{member.introduction}</p>
              <p className="person-affiliation">Alrata Art of Dentistry <span aria-hidden="true">/</span> St. Louis, MO</p>
              <Link className="button button--light" href={contact.bookingHref}>Book an appointment <ArrowRight size={18} aria-hidden="true" /></Link>
              <ul className="person-focus" aria-label={`${member.shortName}'s areas of focus`}>
                {member.focus.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <figure className="person-hero-photo">
              <TeamPortrait member={member} eager sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1328px) 40vw, 512px" />
              <figcaption>{member.shortName}<span>{member.designation}</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <div className="section site-container person-details">
        <div className="person-story">
          <section aria-labelledby="person-about-title">
            <p className="people-eyebrow">Get to know {member.shortName}</p>
            <h2 id="person-about-title">Care with a personal touch.</h2>
            {member.biography.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </section>
          <section className="person-background" aria-labelledby="person-background-title">
            <h2 id="person-background-title">Education &amp; background</h2>
            <dl>{member.credentials.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
          </section>
          <section className="person-personal" aria-labelledby="person-personal-title">
            <p className="people-eyebrow">Beyond the practice</p>
            <h2 id="person-personal-title">The person behind the role.</h2>
            <p>{member.personal}</p>
          </section>
        </div>
        <aside className="person-hours" aria-labelledby="person-hours-title">
          <Clock3 size={25} strokeWidth={1.5} aria-hidden="true" />
          <p className="people-eyebrow">Plan your visit</p>
          <h2 id="person-hours-title">{member.shortName}’s working hours</h2>
          <p className="person-hours-zone">Local St. Louis time</p>
          <dl>{Object.entries(member.hours).map(([day, hours]) => <div key={day}><dt>{day}</dt><dd>{hours ?? 'Not listed'}</dd></div>)}</dl>
          <p className="person-hours-note">These are {member.shortName}’s published working hours. Please contact our office to confirm appointment availability.</p>
          <a className="button button--primary" href={contact.phoneHref}><Phone size={16} aria-hidden="true" /> {contact.phoneDisplay}</a>
          <Link className="text-link" href={contact.bookingHref}>Plan an appointment <ArrowRight size={16} aria-hidden="true" /></Link>
        </aside>
      </div>

      <section className="person-colleagues" aria-labelledby="person-colleagues-title">
        <div className="site-container">
          <div className="person-colleagues-heading"><h2 id="person-colleagues-title">More familiar faces.</h2><Link className="text-link" href="/our-team"><ArrowLeft size={16} aria-hidden="true" /> Meet the full team</Link></div>
          <div className="person-colleagues-grid">
            {teamProfiles.filter(profile => profile.slug !== member.slug).map(profile => (
              <Link key={profile.slug} className="person-colleague" href={profile.href}>
                <TeamPortrait member={profile} sizes="80px" />
                <span><strong>{profile.shortName}</strong><span>{profile.role}</span></span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <TeamCta />
    </div>
  )
}
