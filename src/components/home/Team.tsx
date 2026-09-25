import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { team } from '@/features/home/content'
import Reveal from '@/components/shared/Reveal'
import MediaPlaceholder from '@/components/shared/MediaPlaceholder'

export default function Team() {
  return (
    <section id="team" className="section" aria-labelledby="team-title">
      <div className="site-container">
        <Reveal className="section-heading section-heading--split">
          <h2 id="team-title">Meet the people caring for you.</h2>
          <p>A familiar, approachable team helps make every visit feel more comfortable.</p>
        </Reveal>
        <div className="team-grid horizontal-mobile">
          {team.map((member) => (
            <article key={member.name} className="team-member">
              <MediaPlaceholder media={member.media} label="Team portrait" sizes="(max-width: 767px) 66vw, (max-width: 1080px) 33vw, 240px" />
              <h3>{member.name}</h3>
              <p>{member.designation}</p>
              <Link href={member.href} aria-label={`View profile: ${member.shortName}`}>View profile <ArrowRight size={15} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
        <Link className="text-link team-all" href="/our-team">Meet the full team <ArrowRight size={17} aria-hidden="true" /></Link>
      </div>
    </section>
  )
}
