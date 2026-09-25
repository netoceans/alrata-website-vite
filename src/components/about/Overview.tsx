import Image from 'next/image'
import Link from 'next/link'
import { leadDentist } from '@/features/team/content'
import { ArrowRight } from 'lucide-react'
import Reveal from '@/components/shared/Reveal'
import { overview } from '@/features/about/content'

export default function Overview() {
  return (
    <section id="our-practice" className="section about-overview" aria-labelledby="about-overview-title">
      <div className="site-container about-overview-grid">
        <Reveal className="about-section-copy">
          <p className="about-eyebrow">{overview.eyebrow}</p>
          <h2 id="about-overview-title">{overview.title}</h2>
          <p className="about-section-lead">{overview.lead}</p>
          {overview.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <Link className="text-link" href={leadDentist.href}>
            Meet Dr. Alrata <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal className="about-overview-media">
          <Image
            fill
            loading="lazy"
            sizes="(max-width: 820px) 78vw, 440px"
            src={overview.media.src}
            alt={overview.media.alt}
          />
        </Reveal>
      </div>
    </section>
  )
}
