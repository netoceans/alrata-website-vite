import Link from 'next/link'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { leadDentist, supportingTeam } from './content'
import { TeamBreadcrumbs, TeamCard, TeamCta, TeamPortrait } from './TeamParts'
import './team.css'

export default function TeamPage() {
  return (
    <div className="people-page">
      <section className="people-intro" aria-labelledby="people-title">
        <div className="site-container">
          <TeamBreadcrumbs />
          <div className="people-intro-grid">
            <div>
              <p className="people-eyebrow">Our team · St. Louis, Missouri</p>
              <h1 id="people-title">Good care begins<br />with <span>good people.</span></h1>
            </div>
            <div className="people-intro-aside">
              <p>A dentist who listens. Hygienists who put you at ease. A familiar face to help with the details. Meet the people behind your care at Alrata.</p>
              <a className="text-link" href="#meet-the-team">Get to know us <ArrowDown size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
      </section>

      <section id="meet-the-team" className="people-lead" aria-labelledby="people-doctor-title">
        <div className="site-container people-lead-grid">
          <figure className="people-lead-photo">
            <TeamPortrait member={leadDentist} eager sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1328px) 43vw, 550px" />
            <figcaption><span>Meet your dentist</span><span>DDS</span></figcaption>
          </figure>
          <div className="people-lead-copy">
            <p className="people-eyebrow">A personal approach to your smile</p>
            <h2 id="people-doctor-title">Dr. Mamdouh<br />Alrata<span className="people-degree">DDS</span></h2>
            <p className="people-lead-description">{leadDentist.summary}</p>
            <p>Providing care since 2012, Dr. Alrata combines his education at UCLA School of Dentistry with a commitment to helping patients feel informed and comfortable.</p>
            <dl className="people-lead-facts">
              <div><dt>Education</dt><dd>{leadDentist.credentials[0].value}</dd></div>
              <div><dt>Clinical focus</dt><dd>Esthetic &amp; restorative dentistry</dd></div>
            </dl>
            <Link className="button button--light" href={leadDentist.href}>Meet Dr. Alrata <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="people-directory section" aria-labelledby="people-staff-title">
        <div className="site-container">
          <div className="people-section-heading">
            <div><p className="people-eyebrow">The people beside you</p><h2 id="people-staff-title">Here for every<br />part of your visit.</h2></div>
            <p>From dental hygiene to scheduling and insurance questions, our team brings individual strengths and a shared commitment to your care.</p>
          </div>
          <div className="people-grid">{supportingTeam.map(member => <TeamCard key={member.slug} member={member} />)}</div>
        </div>
      </section>
      <TeamCta />
    </div>
  )
}
